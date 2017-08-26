"use strict";

const axios = require("axios");
const tokenizer = require("./tokens/tokenizer");
const dbSynchronizer = require("luca-couchdb-synchronizer");
const users = require("./database/users");

const dependencies = {
  users: users(axios, dbSynchronizer),
  tokenizer
};

module.exports = dependencies;
