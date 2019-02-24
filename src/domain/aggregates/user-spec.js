import { expect } from "chai";
import scrypt from "scryptsy";
import { User } from "./user";

const password = {
  salt: "123",
  text: "12345678",
  hashed: scrypt("12345678", "123", 2048, 8, 1, 64).toString("hex")
};

describe("user test suite", () => {
  describe("when user is created", () => {
    let user;
    const userParameters = {
      id: "123",
      email: "test@domain.com",
      password: password.hashed,
      salt: password.salt
    };

    beforeEach(() => {
      user = new User(userParameters);
    });

    it("should include the id", () => {
      expect(user.id).to.equal(userParameters.id);
    });

    it("should include the email", () => {
      expect(user.email).to.equal(userParameters.email);
    });

    it("should include the id", () => {
      expect(user.email).to.equal(userParameters.email);
    });

    describe("when a bad password is used to authenticate", () => {
      it("should not authenticate", () => {
        expect(user.getToken(`${password.text}extra`)).to.not.exist;
      });
    });

    describe("when a good password is used to authenticate", () => {
      it("should authenticate", () => {
        expect(user.getToken(password.text)).to.exist;
      });
    });
  });

  describe("when a short password is used to create a user", () => {
    it("should not create", () => {
      try {
        new User({
          id: "123",
          email: "test@domain.com",
          password: "1234567",
          salt: "123"
        });
        expect(true).to.be.false;
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("when an invalid email is used to create a user", () => {
    it("should not create a user", () => {
      try {
        new User({
          id: "123",
          email: "invalid@address",
          password: "12345678",
          salt: "123"
        });
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("when a salt is not provided", () => {
    const userParameters = {
      id: "123",
      email: "invalid@address.com",
      password: "12345678"
    };

    it("should generate a 32 byte salt", () => {
      const user = new User(userParameters);
      expect(user.salt.length).to.equal(32);
    });

    it("should set the password", () => {
      const user = new User(userParameters);
      expect(user.password).to.exist;
    });

    it("should hash the password into a 128 byte string", () => {
      const user = new User(userParameters);
      expect(user.password.length).to.equal(128);
    });
  });
});
