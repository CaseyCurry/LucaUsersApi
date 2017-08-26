"use strict";

const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
const registerUser = require("./register-user");

chai.use(spies);

describe("register user test suite", () => {
  describe("unit test suite", () => {
    describe("success test suite", () => {
      const successStatus = 201;
      const token = "123";
      const request = {
        body: {
          "email": "email"
        }
      };
      const dependencies = {
        users: {
          register: () => {},
          find: () => {
            return null;
          }
        },
        tokenizer: {
          generate: () => {
            return token;
          }
        }
      };

      it("should report status as created", async() => {
        const response = {
          status: (status) => {
            expect(status)
              .to
              .equal(successStatus);
          },
          send: () => {},
          end: () => {}
        };
        await registerUser(request, response, dependencies);
      });

      it("should register the user", async() => {
        const response = {
          status: () => {},
          send: () => {},
          end: () => {}
        };
        const spy = chai.spy.on(dependencies.users, "register");
        await registerUser(request, response, dependencies);
        expect(spy)
          .to
          .have
          .been
          .called
          .with(request.body);
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
        await registerUser(request, response, dependencies);
      });
    });

    describe("duplicate test suite", () => {
      const conflictStatus = 409;
      const request = {
        body: {
          "email": "email"
        }
      };
      const dependencies = {
        users: {
          find: () => {
            return {
              "email": "email"
            };
          }
        }
      };

      it("should report status as conflict", async() => {
        const response = {
          status: (status) => {
            expect(status)
              .to
              .equal(conflictStatus);
          },
          end: () => {}
        };
        await registerUser(request, response, dependencies);
      });
    });
  });
});
