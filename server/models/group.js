// Enable Strict mode to catch common errors
"use strict";

// Imports
const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");
const { sqlForPartialUpdate, sqlForPartialInsert } = require("../helpers/sql");

/** Query methods for groups table */
class Group {
    /** add class method
     * Inserts a new row into the groups table
     * 
     * Parameters:
     * - Object: { host, title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }
     * 
     * Returns: { host, title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }
     * 
     * Throws BadRequestError if no host provided
    */
   static async add(data = {}) {
       // access keys of data
       const keys = Object.keys(data);
       
       // check for data
       if( keys.length === 0 ) throw new BadRequestError('No data');
       // check for host
       if( !data.host ) throw new BadRequestError('No host');

    // use sqlForPartialInsert to create components of the query string
    let { insertColumns, valuesIndecies, values } = sqlForPartialInsert(
        data,
        {
            gameEdition: "game_edition",
            isActive: "is_active",
            isRemote: "is_remote",
            maxPlayers: "max_players",
            isPublic: "is_public",
            currentPlayers: "current_players"
        }
    );

    // make query string
    // { host, title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }
    const queryString = `
        INSERT INTO groups
            (${insertColumns})
        VALUES
            (${valuesIndecies})
        RETURNING
            id,
            host,
            title,
            description,
            game_edition AS "gameEdition",
            is_active AS "isActive",
            is_remote AS "isRemote",
            max_players AS "maxPlayers",
            is_public AS "isPublic",
            location,
            current_players AS "currentPlayers"
            `;
    // try to insert into groups
    const query = await db.query(queryString, [...values]);

    // return result of query
    return query.rows[0];
   }

   /** findAll class method
    * Retrieves all rows in groups table
    * 
    * Returns: [{ id, host, title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }, ...]
    */
   static async findAll() {
    // make query to groups
    const groups = await db.query(`
        SELECT id,
               host,
               title,
               description,
               game_edition AS "gameEdition",
               is_active AS "isActive",
               is_remote AS "isRemote",
               max_players AS "maxPlayers",
               is_public AS "isPublic",
               location,
               current_players AS "currentPlayers"
        FROM groups
        ORDER BY id`
    );

    return groups.rows
   }

   /** get class method 
    * Retrieves a specific group using the group's id
    * 
    * Parameters:
    * - id: (int) valid group id
    * 
    * Returns: { id, host, title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }
    * 
    * Throws NotFoundError if no group at id
   */
  static async get(id) {
    // make query
    const query = await db.query(`
        SELECT id,
               host,
               title,
               description,
               game_edition AS "gameEdition",
               is_active AS "isActive",
               is_remote AS "isRemote",
               max_players AS "maxPlayers",
               is_public AS "isPublic",
               location,
               current_players AS "currentPlayers"
        FROM groups
        WHERE id = $1`,
        [id]
    );

    const group = query.rows[0];

    // check that there a group is found
    if( !group ) throw new NotFoundError(`No group: ${id}`);

    return group;
  }

  /** update class method
   * Updates a group at id with data (Partial Update)
   * 
   * Parameters:
   * - data: (obj) can include { title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }
   * 
   * Returns: { id, host, title, description, gameEdition, isActive, isRemote, maxPlayers, isPublic, location }
   * 
   * Throws NotFoundError if no group at id
   * Throws BadRequestError if no data
  */
  static async update(id, data={}) {
    // check that parameters are passed properly
    if( !id ) throw new BadRequestError(`No id`);

    // access keys of data
    const keys = Object.keys(data);
    if( keys.length === 0 ) throw new BadRequestError(`No data`);

    // use sqlForPartialUpdate to get the components for queryString
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
            gameEdition: "game_edition",
            isActive: "is_active",
            isRemote: "is_remote",
            maxPlayers: "max_players",
            isPublic: "is_public",
            currentPlayers: "current_players"
        }
    );

    // create index for id
    const idVarIdx = "$" + (values.length + 1);

    // make query string
    const queryString = `UPDATE groups
                         SET ${setCols}
                         WHERE id = ${idVarIdx}
                         RETURNING id,
                                   host,
                                   title,
                                   description,
                                   game_edition AS "gameEdition",
                                   is_active AS "isActive",
                                   is_remote AS "isRemote",
                                   max_players AS "maxPlayers",
                                   is_public AS "isPublic",
                                   location,
                                   current_players AS "currentPlayers"
                                   `;
    
    // make query with queryString and values
    const query = await db.query(queryString, [...values, id]);
    const group = query.rows[0];

    // check that group exists
    if( !group ) throw new NotFoundError(`No group: ${id}`);

    return group;
  }

  /** remove class method
   * Deletes the group at id
   * 
   * Parameters:
   * - id: (int) valid id
   * 
   * Returns: undefined
   * 
   * Throws NotFoundError if no group at id
   */
  static async remove(id) {
    // make DELETE query to database
    let query = await db.query(`
        DELETE FROM groups
        WHERE id = $1
        RETURNING id`,
        [id]
    );

    // access removed id
    const removedId = query.rows[0];

    if( !removedId ) throw new NotFoundError(`No group: ${id}`);

    return {message: `Group ${id} removed.`};
  }
}

// Exports
module.exports = Group;