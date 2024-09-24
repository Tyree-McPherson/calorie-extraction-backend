# Calorie Extraction Backend

This project is a serverless application that extracts data from a website and
stores it in a Firestore database.

Click [here](https://github.com/Tyree-McPherson/calorie-extraction-frontend)
to view the repository for the frontend of Calorie Extraction.

## Installation

1. Clone the repository
2. Install the dependencies with `npm install`
3. Install firebase-tools globally by running `npm install -g firebase-tools`
4. Create a new Firebase project and enable the Firestore database
5. Create a new service account and generate a private key file
6. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of
the private key file
7. Rename the `.firebaserc.example` file to exclude `.example` and replace
`FIREBASE_PROJECT_ID` with your Firebase's Project ID.
8. Run `firebase use <project-id>` to select the project
9. Run `firebase deploy --only functions` to deploy the functions

## Development

To run the development environment, cd into `functions` and run `npm start`.

## Usage

The functions can be called with an HTTP request. The request should contain
the following data:

* `userId`: The ID of the user in the Firestore database
* `collection`: The name of the collection in the Firestore database
* `documentData`: The data to be updated in the Firestore database

The functions will return a JSON response with the following data:

* `valid`: A boolean indicating whether the request was valid or not
* `message`: A string describing the result of the request
* `status`: The HTTP status code of the response

## Functions

### `getCollection`

This function retrieves a collection from the Firestore database and returns
it as a JSON response.

### `updateCollection`

This function updates a collection in the Firestore database with the data
provided in the request.

### `signup`

This function creates a new user with the provided email and password and
returns a JSON response with the user's data.

## Firebase Emulators

The Firebase Emulators can be used to run the backend locally. To start the
emulators, run `firebase emulators:start --only functions,firestore,auth`.

## Deploying to Firebase

Add a `.env.production` file in the `functions` directory. Add a `ORIGIN`
key with the domain name of your website as the value.

To deploy the backend to Firebase, cd into `functions` and run
`npm run deploy`. This will deploy the
functions to your Firebase project and make them available at
`https://<server-region>-<project-id>.cloudfunctions.net/<function-name>`.