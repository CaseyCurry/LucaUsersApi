"use strict";

const expect = require("chai")
  .expect;
const tokenizer = require("./tokenizer");
const jwt = require("jwt-simple");
const secret = require("./secret");

describe("tokenizer test suite", () => {
  const email = "email";
  const token = tokenizer.generate(email);
  const payload = jwt.decode(token, secret);

  it("should generate token", () => {
    expect(token)
      .to.be.ok;
  });

  it("should add email to token", () => {
    expect(payload.email)
      .to
      .equal(email);
  });

  it("should expire token after one hour", () => {
    const durationInHours = 4;
    const allowanceForTestInSeconds = 5;
    const maxTime = Math.floor(new Date()
      .getTime() / 1000) + (durationInHours * 60 * 60) + allowanceForTestInSeconds;
    const minTime = maxTime - (allowanceForTestInSeconds * 2);
    expect(payload.exp)
      .to
      .be
      .within(minTime, maxTime);
  });
});
