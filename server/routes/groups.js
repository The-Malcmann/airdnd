// Enable Strict mode to catch common mistakes
"use strict";

// Imports
const jsonschema = require("jsonschema");
const express = require("express");
const { authenticateJWT, 
    ensureAdmin, 
    ensureCorrectUserOrAdmin, 
    ensureLoggedIn,
    ensureHost} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Group = require("../models/group");
const Member = require("../models/member");
const groupNewSchema = require("../schemas/groupNew.json");
const groupUpdateSchema = require("../schemas/groupUpdate.json");

const router = express.Router();

/** POST /
 * Adds a new group.
 * 
 * TODO: add host from new group to members
 * 
 * Returns: {group: {id, host, gameEdition, isActive, isRemote, maxPlayers, isPublic, location}}
 * 
 * Auth: logged in or admin
 */
router.post("/", authenticateJWT, ensureLoggedIn, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, groupNewSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const group = await Group.add(req.body);
        if( group ) {
            await Member.add(group.host, group.id, true);
        };  

        return res.status(201).json({ group });
    }
    catch (err) {
        return next(err);
    }
});

/** GET /groups
 * Retrieves all groups
 * 
 * Returns: {groups: [{id, host, gameEdition, isActive, isRemote, maxPlayers, isPublic, location, currentPlayers}, ...]}
 */
router.get("/", async function(req, res, next) {
    try{
        const groups = await Group.findAll();
        return res.json({ groups });
    }
    catch (err) {
        return next(err);
    }
});

/** GET /groups/:id
 * Retrieves a group at id
 * 
 * Returns: {group:  {id, host, gameEdition, isActive, isRemote, maxPlayers, isPublic, location, currentPlayers}}
 * 
 * auth: loggedIn or admin
 */
router.get("/:id", async function(req, res, next) {
    try {
        const id = req.params.id
        const group = await Group.get(id);

        return res.json({ group });
    }
    catch (err) {
        return next(err);
    }
});

/** PATCH /groups/:id
 * Updates a group at id
 * 
 * Req.body can include: {id, host, gameEdition, isActive, isRemote, maxPlayers, isPublic, location, currentPlayers}
 * 
 * Returns: {group:  {id, host, gameEdition, isActive, isRemote, maxPlayers, isPublic, location, currentPlayers}}
 * 
 * auth: is host or admin
 */
router.patch("/:id", authenticateJWT, ensureHost, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, groupUpdateSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const group = await Group.update(req.params.id, req.body);
        return res.json({ group });
    }
    catch (err) {
        return next(err);
    }
});

/** DELETE /groups/:id
 * Removes a group at id
 * 
 * Returns: {message}
 * 
 * auth: Host or admin
 */
router.delete("/:id", authenticateJWT, ensureHost, async function(req, res, next) {
    try{
        const message = await Group.remove(req.params.id);
        return res.json(message);
    }
    catch (err) {
        return next(err);
    }
})
// Exports
module.exports = router;