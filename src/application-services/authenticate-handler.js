import { userRepository } from "../infrastructure/aws/dynamoDb/user-repository";

export const authenticate = async event => {
  try {
    const email = event.queryStringParameters.email;
    const enteredPassword = JSON.parse(event.body).password;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    const token = user.getToken(enteredPassword);
    if (!token) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
      body: token
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
