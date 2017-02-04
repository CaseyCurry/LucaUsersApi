"use strict";

const jwt = require("jwt-simple");
const secret = require("./secret");
const durationInHours = 4;

const generate = (email) => {
  const payload = {
    email,
    exp: Math.floor(new Date()
      .getTime() / 1000) + (durationInHours * 60 * 60)
  };
  const token = jwt.encode(payload, secret);
  return token;
};

module.exports.generate = generate;
