import { User } from "../../../domain/aggregates/user";
import { client } from "./client";

const table = process.env.usersTable;

const userRepository = {
  create: user => {
    return client
      .put({
        TableName: table,
        Item: user,
        ReturnValues: "NONE"
      })
      .promise();
  },
  getByEmail: email => {
    return client
      .query({
        TableName: table,
        IndexName: "ByEmail",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email }
      })
      .promise()
      .then(data => {
        if (data.Count) {
          const user = new User(data.Items[0]);
          return user;
        }
      });
  }
};

export { userRepository };
