import { userRepository } from "../infrastructure/aws/dynamoDb/user-repository";
import { User } from "../domain/aggregates/user";

// TODO: unit test
// TODO: password change
export const register = async event => {
  try {
    let user;
    let body;
    try {
      body = JSON.parse(event.body);
      if (body.salt) {
        // this will make sure the password is hashed by the User aggregate
        delete body.salt;
      }
      user = new User(body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*"
        },
        body: `"${error.message}"`
      };
    }
    const existingUser = await userRepository.getByEmail(user.email);
    if (existingUser) {
      // TODO: test to make sure 409 will get sent back to browser without Access-Control-Allow-Origin header
      return {
        statusCode: 409
      };
    }
    await userRepository.create(user);
    const token = user.getToken(body.password);
    return {
      statusCode: 201,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
      body: `"${token}"`
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500
    };
  }
};
