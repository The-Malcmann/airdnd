// Enable strict mode to help catch common coding mistakes
"use strict";

/** Database setup for Pomodoro App */
// Imports
const { Client } = require("pg");
const { getDatabaseUri } = require("./config")

// console.log("db.js process.env: ", process.env);

// declare mutable database variable
let db;

// modify db to use either the db or testing db depending on enviornment
if ( process.env.NODE_ENV === 'production') {

    // console.log("NODE_ENV set to 'production': ", getDatabaseUri());

    db = new Client({
        connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false
        }
    })
}
else {

    // console.log("NODE_ENV set to 'test': ", getDatabaseUri());

    db = new Client({
        connectionString: getDatabaseUri(),
    })
}

// connect application to database
db.connect();

// Exports
module.exports = db;