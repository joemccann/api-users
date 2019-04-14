# SYNOPSIS

👷🏽‍♀️ CRUD operations for Google Cloud Functions APIs for a `users` Collection in Firestore.

## REQUIREMENTS

1. A Google Cloud Account.
2. Billing Enabled.
3. API and Firestore Access Enabled.
4. `gcloud` CLI installed and in your `$PATH`.
5. A preferred configuration created ( `gcloud init` ).

## USAGE

```sh
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-users --data '{"username": "foo", "email":"test@gmail.com"}' -H "Content-Type: application/json"
```

The expected response:

```js
{
  "data": "OK"
}
```

Or in the case there is a failure:

```js
{
  "err":"Username, foo, already exists."
}
```

## API

```sh
# Create a user by their username (id)
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-users --data '{"username": "foo", "email":"test@gmail.com"}' -H "Content-Type: application/json"

# Get a user by their username (id)
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-users?id=foo

# Update a user by their username (id)
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-users --data '{"username": "foo", "email":"update-test@gmail.com"}' -H "Content-Type: application/json"

# Delete a user by their username
curl -X DELETE https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-users --data '{"username": "foo"}' -H "Content-Type: application/json"
```

## DEPLOY

First, fork or clone this repo, then:

```sh
npm i
```

You need to pass in your [environment variables either in a `.env.yaml` file or as command line arguements](https://cloud.google.com/functions/docs/env-var).  Run the following command in the root of this repository, assuming a `.env.yaml` file:

```sh
gcloud functions deploy api-users --runtime nodejs10 --trigger-http --memory 128MB --env-vars-file .env.yaml
```

You should receive a YAML like response in your terminal including the URL for the Cloud Function.

## TESTS

> NOTE: Your `FIRESTORE_COLLECTION_NAME` should be `users`. If you change it, then you'll need to update your routes above.

```sh
npm i -D
PROJECT={PROJECT} COLLECTION={FIRESTORE_COLLECTION_NAME} npm test
```

## AUTHORS

- [Joe McCann](https://twitter.com/joemccann)

## LICENSE

MIT