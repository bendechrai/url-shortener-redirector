# URL Shortener

## Deploy your own

### Zeit and Fauna accounts

Sign up for a [Zeit](https://zeit.co) and [Fauna](https://fauna.com/) account if you don't have them already, and install the `now` command-line utilities.

### IPGeolocation account

Sign up for an [IP Geolocation](https://ipgeolocation.io/) account, and grab the API key - you'll need it in the next step.

### Clone and deploy!

Now run the following in your terminal:

```
git clone https://github.com/bendechrai/url-shortener.git
cd url-shortener
now secret add ipgeolocation_apikey <XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>
now --prod
```

### Integrate Fauna into Zeit

1. [Create a new Fauna Database](https://dashboard.fauna.com/db-new/) called `url-shortener`;
1. Add the [Fauna Integration](https://zeit.co/integrations/faunadb) into your Zeit account;
1. Create a new [Fauna Database Server Key](https://dashboard.fauna.com/keys-new/@db/url-shortener) for your new database and copy the key;
1. Create two collections in the database, called `redirects` and `clicks`; and
1. Paste this key into Zeit's Fauna Integration setup when prompted, and link the Fauna database with the new Zeit project created during deployment.

## Managing redirects

### One at a time

Head to the [`redirects` collection](https://dashboard.fauna.com/collections/redirects/@db/url-shortener), click on [New Document](https://dashboard.fauna.com/collections/documents-new/redirects/@db/url-shortener), and enter something in the following format:

```
{
  "shortcode": "twitter",
  "dest": "https://twitter.com/bendechrai"
}
```

### Multiples

If you are migrating from another system, you can generate a script that looks like this:

```
Create(Collection("redirects"), { data: { "shortcode": "contact", "dest": "https://bendechrai.com/contact/" } });
Create(Collection("redirects"), { data: { "shortcode": "github", "dest": "https://github.com/bendechrai" } });
Create(Collection("redirects"), { data: { "shortcode": "linkedin", "dest": "https://www.linkedin.com/in/bendechrai/" } });
Create(Collection("redirects"), { data: { "shortcode": "twitter", "dest": "https://twitter.com/bendechrai" } });
Create(Collection("redirects"), { data: { "shortcode": "youtube", "dest": "https://www.youtube.com/channel/UCY5SDWGg5Wa1ptwFF1EXQPg" } });
```

Take this, and paste it into the [Fauna Web Shell](https://dashboard.fauna.com/webshell/@db/url-shortener).

## Default redirect

If you go to the base URL of your URL Shortener (i.e.  https://url-shortener.yourname.now.sh/), this system will look for a shortcode of `__default__`. Creating a record like this will let you set the destination for this scenario:

```
{
  "shortcode": "__default__",
  "dest": "https://bendechrai.com"
}
```

## Duplicates

Currently, this redirector will fail if the shortcode cannot be found, or it is found more than once.