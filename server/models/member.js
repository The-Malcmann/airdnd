"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

class Member {
    static async add(userId, groupId) {
        if (!userId || !groupId) {
            throw new BadRequestError("must specify a userId (username) and a groupId");
        }
        if (typeof userId != "string" || typeof groupId != "number") {
            throw new BadRequestError("userId (username) must be a string and groupId must be a number");
        }
        const result = await db.query(`
            INSERT INTO members(user_id, group_id)
            VALUES($1, $2)
            RETURNING user_id, group_id
        `,
            [userId, groupId]
        );

        const member = result.rows[0]


        return member;

    }

    static async findAll(groupId, acceptedStatus) {

        const result = await db.query(`
                SELECT user_id as "userId", group_id AS "groupId", is_accepted as "isAccepted", is_dm as "isDm"
                FROM members
                WHERE group_id = $1 AND is_accepted = $2 
                ORDER BY group_id
                `, [
            groupId, acceptedStatus
        ]);

        return result.rows;
    }

    static async get(userId, groupId) {
        const result = await db.query(`
                SELECT user_id as "userId", group_id AS "groupId", is_accepted as "isAccepted", is_dm as "isDm"
                FROM members
                WHERE user_id = $1 AND group_id = $2
            `, [
            userId, groupId
        ])
        if (result.rowCount == 0) throw new NotFoundError(`No member: ${userId}, ${groupId}`)

        return result.rows[0];
    }

    static async update(userId, groupId, data) {
        if(!data) throw new BadRequestError("Must provide data to update")

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                isAccepted: "is_accepted",
                isDm: "is_dm"
            });

        const userIdx = "$" + (values.length + 1);
        const groupIdx = "$" + (values.length + 2);


        const updateQuery = await db.query(`
                UPDATE members
                SET ${setCols}
                WHERE user_id = ${userIdx} AND group_id = ${groupIdx}
                RETURNING user_id as "userId", group_id AS "groupId", is_accepted as "isAccepted", is_dm as "isDm"
            `, [...values, userId, groupId]);
        const updatedMember = updateQuery.rows[0];

        if (updateQuery.rowCount == 0) throw new NotFoundError(`No member: ${userId}, ${groupId}`)


        return updateQuery.rows[0]
    }

    static async remove(userId, groupId) {
        let result = await db.query(
              `DELETE
               FROM members
               WHERE user_id = $1 AND group_id = $2
               RETURNING user_id as "userId", group_id as "groupId"`,
            [userId, groupId],
        );
        const member = result.rows[0];
    
        if (!member) throw new NotFoundError(`No member: ${userId}, ${groupId}`);

        return member
      }
}
module.exports = Member;