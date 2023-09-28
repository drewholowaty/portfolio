const redis = require('redis');
const { Client } = require("pg");

require("dotenv").config();

// POSTGRESQL DB object
db = new Client({
  user: `${process.env.POSTGRESQL_USER}`,
  password: `${process.env.POSTGRESQL_PASSWORD}`,
  host: `${process.env.POSTGRESQL_HOST}`,
  database: `${process.env.POSTGRESQL_DATABASE}`,
  port: `${process.env.POSTGRESQL_PORT}`,
});

// Redis Cache object
const cache = redis.createClient({
  socket: {
    host: `${process.env.REDIS_HOST}`,
    port: "6379"
  },
});

module.exports = {
  db: db,
  cache: cache
};

