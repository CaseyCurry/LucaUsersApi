"use strict";

const authenticateUser = async(request, response, dependencies) => {
  const email = request.params.email;
  const password = request.body.password;
  const user = await dependencies.users.find(email);
  if (!user) {
    response.status(404);
  } else if (password === user.password) {
    const token = dependencies.tokenizer.generate(user.email);
    response.status(200);
    response.send(token);
  } else {
    response.status(401);
  }
  response.end();
};

module.exports = authenticateUser;
