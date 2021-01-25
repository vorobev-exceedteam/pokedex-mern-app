#Demo
Demo is available [here](https://pokedex-pokeapi-mern.herokuapp.com/).

#How to run
If you want to run this project locally you should add .env files with configured variables for a server and client, type following commands:

### `npm install`

### `npm run heroku-postbuild`

### `npm run start`

Then you should go to localhost:{PORT that you set in .env file}.

#Environment Variables

* /.env
    * NODE_ENV - Environment of nodejs;

  
    * PORT - Port of the server;
  

    * MONGODB_URI - URI of MongoDB;
  

    * AUTH_SECRET - Secret for an auth jwt;
  

    * REFRESH_SECRET - Secret for a refresh jwt;
  

    * AUTH_TOKEN_EXPIRATION_TIME - Expiration time of an auth jwt token;
  

    * REFRESH_TOKEN_EXPIRATION_TIME - Expiration time of a refresh jwt token;
  

    * GOOGLE_CLIENT_ID - ID of client for google auth;
  

    * GOOGLE_CLIENT_SECRET - Secret of client for google auth;
  

    * TARGET_ORIGIN - Origin of client (if you have client on a different server, otherwise it should be the same as server origin);
  

    * SERVER_ORIGIN - Origin of server (if you have client on a different server, otherwise it should be the same as server origin).
  

* ./client/.env
    * REACT_APP_RECEIVE_ORIGIN - Origin of server (if you have client on a different server, otherwise it should be the same as server origin).

#What could be added

* Filter of pokemons by stats, weaknesses, abilities;

* More information about pokemon (like evolution, location etc.);

* Email confirmation;

* More authentication services (Like Facebook, Twitter etc.).
