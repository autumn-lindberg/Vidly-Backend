const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const query_string = require("querystring");
const { User } = require("../models/user");
const mongoose = require("mongoose");
// figure out how to do this with express router
const axios = require("axios");

const auth_code_endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const access_token_endpoint = "https://oauth2.googleapis.com/token";

// the query parameters that are needed with every request to google OAuth
const query_params = {
  // client id created from google console
  client_id: process.env.CLIENT_ID,
  // redirect url should be /api/callback
  redirect_uri: `http://localhost:80${process.env.REDIRECT_URI}`,
};

// this objects contains information (in the form of query parameters)
// that will be passed to the auth token endpoint
const auth_code_params = {
  ...query_params,
  response_type: "code",
};

// the scopes (portion of user's data) we want to access
const scopes = ["profile", "email", "openid"];

// a url formed with the auth token endpoint and the
// Query String library is used because this is node, not react...
// stringify method takes an object and turns it into a valid query string
const auth_code_url = `${auth_code_endpoint}?${query_string.stringify(
  auth_code_params

  // join the array of scopes with a space, add them at the end of query string
)}&scope=${scopes.join(" ")}`;

// function to get access token
// take auth code, go to Google again and exchange it for access token
const get_access_token = async (auth_code) => {
  // take query params and add auth token and secret to query params
  const access_token_params = {
    ...query_params,
    client_secret: process.env.CLIENT_SECRET,
    code: auth_code,
    grant_type: "authorization_code",
  };

  // return the result of sending a post request to the exchange URI
  return await axios({
    method: "post",
    url: `${access_token_endpoint}?${query_string.stringify(
      access_token_params
    )}`,
  });
};

router.get("/", async (request, response) => {
  // as soon as this endpoint is called, redirect to the auth code url
  // this URL already has query params with client id, redirect URI, and scopes
  try {
    // response goes to /api/callback with auth code in query params
    response.redirect(auth_code_url);
  } catch (error) {
    response.status(500).send(error.message);
    console.log(error.message);
  }
});

// redirect URI should be /api/callback
router.get("/callback", async (request, response) => {
  // get authorization code from request parameter
  const authorization_code = request.query.code;

  // get access token using authorization code
  try {
    const access_token_response = await get_access_token(authorization_code);

    // get access token from payload
    const { access_token } = access_token_response.data;
    // get id token from payload
    const { id_token } = access_token_response.data;

    // decode id token info using google auth library
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const user_data = ticket.getPayload();
    const userid = user_data["sub"];

    // create a user to save in DB
    const user = {
      _id: mongoose.Types.ObjectId(),
      name: user_data["name"],
      email: user_data["email"],
      password: userid,
      isAdmin: false,
    };

    // save!
    const newUser = new User(user);
    await newUser.save();

    // do stuff with data
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;
