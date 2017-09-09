"use strict";

const wrap = require("express-async-wrap");
const authenticateUser = require("./route-handlers/authenticate-user");
const registerUser = require("./route-handlers/register-user");

module.exports.register = (dependencies) => {
  return (app) => {
    app.post("/api/users/:email", wrap(async(request, response) => {
      await authenticateUser(request, response, dependencies);
    }));

    app.post("/api/users", wrap(async(request, response) => {
      await registerUser(request, response, dependencies);
    }));
  };
};
