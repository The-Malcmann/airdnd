const jwt = require("jsonwebtoken");
const { SECRET_KEY, API_KEY, API_SECRET_KEY } = require("../config");
const StreamChat = require('stream-chat').StreamChat

/** return signed JWT from user data. */
function createToken(user) {
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };
  const signature = jwt.sign(payload, SECRET_KEY)
  return signature;
}

function createChatToken(user) {
  console.log(API_KEY)
  console.log(API_SECRET_KEY)
  const serverClient = StreamChat.getInstance(API_KEY, API_SECRET_KEY);
  // Create User Token
  const token = serverClient.createToken(user.username);
  return token;
}

module.exports = { createToken, createChatToken };
