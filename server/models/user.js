"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
    /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, password, email, isAdmin }) {
  const duplicateCheck = await db.query(
        `SELECT username
         FROM users
         WHERE username = $1`,
      [username],
  );

  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate username: ${username}`);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  const result = await db.query(
        `INSERT INTO users
         (username,
          password,
          email,
          is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING username, email, is_admin AS "isAdmin"`,
      [
        username,
        hashedPassword,
        giemail,
        isAdmin,
      ],
  );

  const user = result.rows[0];

  return user;
}

}