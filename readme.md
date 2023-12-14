# Vidly-Backend

## Summary:

Vidly backend is the server code for the Vidly app. It creates an express server and puts all requests through some assorted middleware. Middleware libraries are listed under **Dependencies**, and custom middlewares include:

- `auth.js`: check if user is logged in
- `admin.js`: check if user has admin privileges
- `error.js`: take any errors and log them to the console
- `try-catch.js`: wrap all requests in a try-cach block
- `validate.js`: put posted data through a custom validator function

## Workflow:

- Node.js
- Express (server)
- Security Middleware
  - Helmet
  - CORS
  - Tiny (log HTTP requests)
- API build using Express Router

## To-Do and Next Steps (see "projects" tab in repo)

- [ ] Add more logging
- [ ] Change DB to MySQL
- [ ] Add end-to-end testing using Puppeteer library
- [ ] Separate API logic from business logic
- [ ] Separate **User** into **Clients** and **Members**
  - **Sample Clients:**
    - Default (no client)
    - Disney
    - AARP
    - Fantasy Video
- [ ] Store client in a cookie, display in URL parameter

## Known Issues

- None (yet!)

## Dependencies

- axios **(make requests to server outside of API)**
- bcryptjs **(password encryption)**
- config **(set config variables)**
- cors
- debug
- dotenv **(alternative to config variables)**
- express
- express-async-errors
- fawn **(do multiple mongo calls in one request)**
- google-auth-library **(decode JWT returned from OAuth)**
- helmet **(securtiy)**
- joi **(validation)**
- jsonwebtoken **(generate a JWT)**
- lodash
- moment **(parse and do math with JS date type)**
- mongoose
- morgan **(security)**
- nodemon
- pug **(view model)**
- query-string **(parse query params for OAuth)**
- swagger-ui-express **(display OpenAPI docs)**
- winston **(logging)**
- winston-mongodb
- yamljs **(convert YAML to JSON)**

## Organization:

- node_modules
  - y'all know that this is
- config
  - holds config variables that `config` library uses
- coverage
  - code coverage graphs for testing (not to go into prod)
- middleware
  - custom middleware functions like `auth.js`, `admin.js`, and `try-catch.js`
- models
  - mongoose models for each data type stored in MongoDB
    - `customer`
    - `genre`
    - `movie`
    - `product`
    - `rental`
    - `user`
- routes
  - API routes for frontend to call
    - **/customers**
    - **/genres**
    - **/google-oauth**
    - **/home** (API Docs Home)
    - **/login**
    - **/movies**
    - **/products**
    - **/rentals**
    - **/returns**
    - **/users**
- startup
  - startup files to clean up index.js
    - `api-docs.js`
    - `config.js`
    - `cors.js`
    - `db.js`
    - `logging.js`
    - `pug.js`
    - `routes.js`
    - `validation.js`
- static
  - img **(source images)**
  - yaml **(OpenAPI YAML spec sheets)**
- tests
  - unit
  - integration
- views
  - `.pug` file for API home
- dockerfile
- logfile.log
- Readme.md
- uncaughtExceptions.log
