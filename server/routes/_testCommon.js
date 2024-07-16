"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Member = require("../models/member");
const Group = require("../models/group");
const { createToken } = require("../helpers/tokens");

const testJobIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM groups");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM members");

  await db.query(`ALTER SEQUENCE groups_id_seq RESTART WITH 1`);

  await User.register({
    username: "u1",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  await Group.add({
    host: "u1",
    title: "u1's group",
    description: "this is gonna be an intense hardcore mode style game, so gear up",
    gameEdition: "5th",
    isActive: true,
    isRemote: true,
    maxPlayers: 6,
    isPublic: true,
  });

  await Member.add("u1", 1, true);
  await Member.add("u2", 1, false);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  u2Token,
  adminToken,
};
