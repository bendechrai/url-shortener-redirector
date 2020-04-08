import faunadb, { query as q } from "faunadb"

const Redirects = async (userRequest, userResponse) => {

    const { FAUNADB_SECRET: faunadb_secret } = process.env
    const client = new faunadb.Client({ secret: faunadb_secret })

    const data = await client
        .query(q.Paginate(q.Match(q.Ref("indexes/all_redirects"))))
        .then(response => {
            const redirectRefs = response.data
            console.log(redirectRefs)
            const getAllRedirectDataQuery = redirectRefs.map(ref => {
                return q.Get(ref)
            });
            return client.query(getAllRedirectDataQuery);
        })
        .catch(error => {
            return []
            userResponse.end()
        })

    const output = data.map(item => {
        return {
            shortcode: item.data.shortcode,
            dest: item.data.dest
        }
    })

    userResponse.send(output)
    userResponse.end()

};

export default Redirects