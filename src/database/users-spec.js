"use strict";

const expect = require("chai")
  .expect;
const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");
const users = require("./users")(axios);
const config = require("./config");

describe("users test suite", () => {
  describe("unit test suite", () => {
    let mockDatabase = null;

    beforeEach(() => {
      mockDatabase = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
      mockDatabase.restore();
    });

    describe("register test suite", () => {
      it("should register the user", async() => {
        const successStatus = 201;
        const email = "email";
        const user = {
          email
        };
        const dataUrl = `${config.database}/users`;
        mockDatabase
          .onPost(dataUrl, user)
          .reply(successStatus);
        await users
          .register(user);
      });

      it("should report error if the email is not provided", async() => {
        try {
          await users
            .register();
        } catch (error) {
          expect(error)
            .to
            .be
            .ok;
        }
      });
    });

    describe("find test suite", () => {
      const email = "email";
      const dataUrl = `${config.database}/users`;

      it("should find a user", async() => {
        const user = {
          email,
          password: "password"
        };
        const getResults = {
          rows: [{
            value: user
          }]
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-email?key="${email}"`)
          .reply(200, getResults);
        const result = await users
          .find(email);
        expect(result)
          .to
          .deep
          .equal(user);
      });

      it("should return null if the email is not provided", async() => {
        const getResults = {
          rows: []
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-email?key="${email}"`)
          .reply(200, getResults);
        const result = await users
          .find(email);
        expect(result)
          .not
          .to
          .be
          .ok;
      });
    });
  });
});
