"use strict";

const registerUser = async(request, response, dependencies) => {
  // expect the user's password to have already been hashed
  const user = request.body;
  const existingUser = await dependencies.users.find(user.email);
  if (existingUser) {
    response.status(409);
  } else {
    await dependencies.users.register(user);
    const token = dependencies.tokenizer.generate(user.email);
    response.status(201);
    response.send(token);
  }
  response.end();
};

module.exports = registerUser;
