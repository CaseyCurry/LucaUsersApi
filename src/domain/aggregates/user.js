import jwt from "jsonwebtoken";
import csprng from "csprng";
import scrypt from "scryptsy";

// https://crackstation.net/hashing-security.htm
const User = class {
  constructor({ id, email, password, salt }) {
    if (!id || typeof id !== "string") {
      throw new Error("The id must have a value and must be a string");
    }
    if (!email || typeof email !== "string" || !isEmailValid(email)) {
      throw new Error(
        "The email must have a value and must be an email address"
      );
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      throw new Error(
        "The password must have a value and must be a string at least 8 characters"
      );
    }
    this.id = id;
    this.email = email;
    if (!salt) {
      this.salt = generateSalt();
      this.password = hashPassword(this.salt, password);
      this.isAuthenticated = () => true;
    } else {
      this.salt = salt;
      this.password = password;
      this.isAuthenticated = () => false;
    }
  }

  getToken(enteredPassword) {
    if (
      !this.isAuthenticated() &&
      hashPassword(this.salt, enteredPassword) !== this.password
    ) {
      return;
    }
    return generateToken(this.id, this.email);
  }
};

export { User };

const isEmailValid = email => {
  var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

const generateSalt = () => {
  // generate a 32 byte string
  const salt = csprng(164, 36);
  return salt;
};

const hashPassword = (salt, enteredPassword) => {
  const numberOfIterations = 2048;
  const memoryFactor = 8;
  const parallelization = 1;
  const lengthInBytes = 64;
  const hash = scrypt(
    enteredPassword,
    salt,
    numberOfIterations,
    memoryFactor,
    parallelization,
    lengthInBytes
  ).toString("hex");
  return hash;
};

const generateToken = (id, email) => {
  const options = { expiresIn: "2h" };
  const payload = {
    tenent: id,
    email: email
  };
  const token = jwt.sign(payload, process.env.jwtSecret, options);
  return token;
};
