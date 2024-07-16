// Enable strict mode to catch common mistakes
"use strict";

/* Shared Configuration for backend of application, can be required in many places */
// Imports
require("dotenv").config();


// Access SECRET_KEY for export
const SECRET_KEY = process.env.SECRET_KEY || "shadow-dev";
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

/* Database Uri Function
 
Checks env var to determine whether the database or test database uri should be returned.
Parameters: -none
*/
function getDatabaseUri(user = DB_USER, password = DB_PASSWORD, host = DB_HOST, port = DB_PORT) {
    // log parameters vals
    // console.log('user: ', user);
    // console.log('password: ', password);
    // console.log('host: ', host);
    // console.log('port: ', port);

    // env vars
    // const u = process.env.DB_USER;
    // const p = process.env.DB_PASSWORD;
    // const h = process.env.DB_HOST
    // const port = process.env.DB_PORT;

    // database name depends on app's environment
    const name = process.env.NODE_ENV === "test" ? "airdnd_test" : "airdnd";

    // console.log(`postgres://${user}:${password}@${host}:${port}/${name}`);

    return `postgres://${user}:${password}@${host}:${port}/${name}`;
};

// Speed up bcrypt during tests
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Log config settings to the console
// console.log("-------------------------------------------");
// console.log("airdnd Config:");
// console.log("SECRET_KEY: ", SECRET_KEY);
// // console.log("PORT: ", PORT.toString());
// console.log("BCRYPT_WORK_FACTOR: ", BCRYPT_WORK_FACTOR);
// console.log("Database: ", getDatabaseUri());
// console.log("-------------------------------------------");

// Exports
module.exports = {
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
}