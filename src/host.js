"use strict";

const app = require("express")();
const apiInitializer = require("luca-api-initializer");
const routes = require("./routes");
const dependencies = require("./dependencies");

// sync the physical database and the definition defined in dependencies.users
dependencies.users.syncDatabase();

apiInitializer.initialize(app, "users-api", routes.register(dependencies));
