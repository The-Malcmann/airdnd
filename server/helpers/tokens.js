const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };
  console.log("createToken SECRET_KEY: ", SECRET_KEY);
  const signature = jwt.sign(payload, SECRET_KEY)
  console.log("createToken signature: ", signature);
  return signature;
}

module.exports = { createToken };
