"use strict";

const config = require("./config");
const dataUrl = `${config.database}/users`;
const byEmailViewName = "by-email";

const users = (database, dbSynchronizer) => {
  return {
    register: async(user) => {
      await database
        .post(dataUrl, user);
    },
    find: async(email) => {
      const response = await database
        .get(`${dataUrl}/_design/doc/_view/${byEmailViewName}?key="${email}"`);
      if (!response.data.rows.length) {
        return null;
      }
      const user = response.data.rows[0].value;
      return user;
    },
    syncDatabase: async() => {
      const views = {
        "views": {
          [byEmailViewName]: {
            "map": "function (doc) {\n  emit(doc.email, doc);\n}"
          }
        },
        "language": "javascript"
      };
      await dbSynchronizer(database, dataUrl, views);
    }
  };
};

module.exports = users;
