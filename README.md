# URL Shortener

## Deploy your own

### Zeit account

Sign up for a Zeit account if you don't have one already, and install the `now` command-line utilities.

### jsonbox.io account

You don't really create an account, you just need to head to [jsonbox.io](https://jsonbox.io) and save the box identifier somewhere safe.

![jsonbox.io main screen](docs/jsonbox.png)

The X's will be a unique code for you to use to connect to the jsonbox API.

***Don't lose this!*** You'll need it for the next step, and also for the future when you need to manage your redirects.

### Clone and deploy!

Now run the following in your terminal:

```
git clone https://github.com/bendechrai/url-shortener.git
cd url-shortener
now secret add urlshortener_jsonbox box_XXXXXXXXXXXXXXXXXXXX
now --prod
```

## Managing redirects

***WIP*** A command-line utility is coming. For now, you can do this manually.

Head to `https://jsonbox.io/dashboard.html?box=box_XXXXXXXXXXXXXXXXXXXX`.

### Adding a new redirect

Say you want to redirect **https://url-shortener.yourname.now.sh/twitter** to **https://twitter.com/yourname**.

In the jsonbox.io dashboard, append **/twitter** to the URL, and set the request body to:

```
{
    "dest": "https://twitter.com/yourname"
}
```

![jsonbox.io dashboard](docs/jsonbox-create.png)

### Using cURL

Of course, you can do this with cURL on the command-line right now:

```
curl https://jsonbox.io/box_XXXXXXXXXXXXXXXXXXXX/twitter \
     -H 'content-type: application/json' \
     --data-binary '{"dest": "https://twitter.com/yourname"}'
```
