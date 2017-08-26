"use strict";

const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
const authenticateUser = require("./authenticate-user");

chai.use(spies);

describe("authenticate user test suite", () => {
  describe("unit test suite", () => {
    const successStatus = 200;
    const notFoundStatus = 404;
    const unauthorizedStatus = 401;
    const request = {
      params: {
        "email": "email"
      },
      body: {
        "password": "password"
      }
    };

    describe("success test suite", () => {
      const token = "123";
      const dependencies = {
        users: {
          find: () => {
            return {
              "email": request.params.email,
              "password": request.body.password
            };
          }
        },
        tokenizer: {
          generate: () => {
            return token;
          }
        }
      };

      it("should report status as success", async() => {
        const response = {
          status: (status) => {
            expect(status)
              .to
              .equal(successStatus);
          },
          send: () => {},
          end: () => {}
        };
        await authenticateUser(request, response, dependencies);
      });

      it("should return a token", async() => {
        const response = {
          status: () => {},
          send: (result) => {
            expect(token)
              .to
              .equal(result);
          },
          end: () => {}
        };
        await authenticateUser(request, response, dependencies);
      });
    });

    it("should report status as not found", async() => {
      const response = {
        status: (status) => {
          expect(status)
            .to
            .equal(notFoundStatus);
        },
        end: () => {}
      };
      const dependencies = {
        users: {
          find: () => {
            return null;
          }
        }
      };
      await authenticateUser(request, response, dependencies);
    });

    it("should report status as unauthorized", async() => {
      const response = {
        status: (status) => {
          expect(status)
            .to
            .equal(unauthorizedStatus);
        },
        end: () => {}
      };
      const dependencies = {
        users: {
          find: () => {
            return {
              "email": request.params.email,
              "password": request.body.password + "invalid"
            };
          }
        }
      };
      await authenticateUser(request, response, dependencies);
    });
  });
});
