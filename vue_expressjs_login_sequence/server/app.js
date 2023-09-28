// libraries and const declarations
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const db = require("./app/db_objects.js").db;
const cache = require("./app/db_objects.js").cache;
const app = express();
const PORT = 3000;

// preliminary middleware functions
app.use(cookieParser());
app.use(express.json()); // parse requests of content-type - application/json
// app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded


// Sets headers
app.use((req, res, next) => {
  res.header({
    // CORS
    "Access-Control-Allow-Origin": process.env.ORIGIN_DOMAIN,
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "accept, content-type, cache-control",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "600",

    "Content-Type": "application/json"
  });

  next();
});

// sets the global timeout to be 3 seconds
app.use((req, res, next) => {
  res.setTimeout(3000, () => {
    console.log('Request has timed out.');
    res.status(408).send({ error: "Request has timed out" });
    return;
  });

  next();
});

// connect to PostgreSQL database
db.connect()
  .then(() => {
    console.log("Successfully connected to PostgreSQL");
  })
  .catch(err => {
    console.error("PostgreSQL connection error", err);
    process.exit();
  });

// handle unexpected database connection error 
db.on('error', err => console.log('PostgreSQL Client Error', err));

// connect to Redis cache
cache.connect()
  .then(() => {
    console.log("Successfully connected to Redis.");
  }); // no catch method because if redis client connection fails, promise is left in perpetual pending state

// listener to handle unexpected redis error
cache.on('TypeError', err => {
  console.log('Redis Client Error', err)
  // process.exit();
});

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Hello world!" });
});

// routes
require('./app/routes/auth.routes')(app); // passes app object as argument to mount routes
require('./app/routes/user.routes')(app);

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}.`);
});

module.exports = app;

