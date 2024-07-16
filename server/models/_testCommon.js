const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testJobIds = [];

async function commonBeforeAll() {

    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM members");
    await db.query("DELETE FROM groups");
    await db.query("DELETE FROM users");

    await db.query(`ALTER SEQUENCE groups_id_seq RESTART WITH 1`);

    const username = await db.query(`
        INSERT INTO users(username,
                          password,
                          email,
                          is_admin)
        VALUES ('u1', $1, 'u1@email.com', false),
               ('admin', $2, 'u2@email.com', true)
        RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]);

    const group = await db.query(`
        INSERT INTO groups(title,
            description,
            host,
            game_edition,
            is_active,
            is_remote,
            max_players,
            is_public,
            location            
        )
        VALUES ('u1 group', 'dnd group for u1', 'u1', '5th', true, true, 6, true, 'Reno, NV')
        RETURNING id`);

    await db.query(`
        INSERT INTO members(
            user_id,
            group_id,
            is_accepted,
            is_dm
        )
        VALUES('u1', 1, true, true)
    `);

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


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
};