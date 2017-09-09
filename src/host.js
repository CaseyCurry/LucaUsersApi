"use strict";

const app = require("express")();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const ApiError = require("./api-error");
const routes = require("./routes");
const dependencies = require("./dependencies");

// sync the physical database and the definition defined in dependencies.users
dependencies.users.syncDatabase();

app.use(helmet());
app.use(cors({
  origin: "*"
}));
app.use(bodyParser.json());

// add a "/" route for health checks
app.get("/", (request, response) => {
  response.status(200);
  response.end();
});

routes.register(dependencies, app);

// Express requires the signature to include all four parameters
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response
    .status(500)
    .send(new ApiError(error));
  response.end();
});

const port = 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
