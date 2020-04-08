import faunadb, { query as q } from "faunadb";
import fetch from "node-fetch";

const getClickInfo = async (data, userRequest) => {
  // Fetch info based on IP address
  const iplookup_url =
    "https://api.ipgeolocation.io/ipgeo?apiKey=" +
    process.env.ipgeolocation_apikey +
    "&ip=" +
    userRequest.headers["x-forwarded-for"];
  const userinfo = await fetch(iplookup_url).then(res => res.json());

  // Build default log message
  return {
    shortcode: data.shortcode,
    referrer: userRequest.headers["referer"],
    useragent: userRequest.headers["user-agent"],
    ipaddress: userRequest.headers["x-forwarded-for"],
    timestamp: new Date().toISOString(),
    userinfo: userinfo
  };
};

const Redirect = async (userRequest, userResponse) => {
  const { FAUNADB_SECRET: faunadb_secret } = process.env;
  const shortcode = userRequest.url.replace("/", "") || "__default__";
  const client = new faunadb.Client({ secret: faunadb_secret });

  const redirectInfo = await client
    .query(q.Paginate(q.Match(q.Ref("indexes/redirect"), shortcode)))
    .then(response => {
      const redirectRefs = response.data;
      const getAllRedirectDataQuery = redirectRefs.map(ref => {
        return q.Get(ref);
      });
      return client.query(getAllRedirectDataQuery);
    })
    .catch(error => userResponse.send("Not found"));

  if (redirectInfo.length != 1 || !redirectInfo[0].data.dest) {
    // Too much, not enough, or invalid data
    userResponse.send("Not found");
  } else {
    // Log the click
    const info = await getClickInfo(redirectInfo[0].data, userRequest);
    const logged = await client.query(
      q.Create(q.Collection("clicks"), { data: info })
    );

    // Redirect user to dest
    userResponse.writeHead(301, { Location: redirectInfo[0].data.dest });
  }

  userResponse.end();
};

export default Redirect;
