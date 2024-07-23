"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, authenticateJWT, ensureLoggedIn, ensureHost } = require("../middleware/auth");
const { BadRequestError, ForbiddenError } = require("../expressError");
const Member = require("../models/member");
const Group = require("../models/group");
const { createToken } = require("../helpers/tokens");
const memberApproveSchema = require("../schemas/memberApprove.json");
const memberRequestSchema = require("../schemas/memberRequest.json");

const router = express.Router();


/** GET / => { members: [ {groupId, firstName, lastName, email }, ... ] }
 *
 * Returns a list of all groups a user is active in
 *
 * 
 **/

router.get("/users/:username/active", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    try {
        const groups = await Member.findAllGroupsForMember(req.params.username, true);
        return res.json({ groups });
    } catch (err) {
        return next(err);
    }
});
router.get("/users/:username/pending", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    try {
        const groups = await Member.findAllGroupsForMember(req.params.username, false);
        return res.json({ groups });
    } catch (err) {
        return next(err);
    }
});
router.get("/groups/:id/", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    try {
        const activeMembers = await Member.findAllMembersForGroup(req.params.id, true);
        const pendingMembers = await Member.findAllMembersForGroup(req.params.id, false);
        return res.json({ activeMembers, pendingMembers });
    } catch (err) {
        return next(err);
    }
});

// Request to join a group
router.post("/users/:username/groups/:id/request", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    try {
        // validate with jsonschema userUpdateSchema
        const validator = jsonschema.validate(req.body, memberRequestSchema);

        // In case of invalid, throw a BadRequestError with all validator errs included.
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const request = await Member.add(req.params.username, req.params.id, false)

        return res.json({ request })
    } catch (err) {
        return next(err);
    }
});

// Approve request to join
router.patch("/users/:username/groups/:id/request", authenticateJWT, ensureHost, async function (req, res, next) {
    try {
        // validate with jsonschema userUpdateSchema
        const validator = jsonschema.validate(req.body, memberApproveSchema);

        // In case of invalid, throw a BadRequestError with all validator errs included.
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const member = await Member.get(req.params.username, req.params.id);
        const request = await Member.update(req.params.username, req.params.id, { isAccepted: true });
        if(!member.isAccepted) {
            const { currentPlayers } = await Group.get(req.params.id);
            await Group.update(req.params.id, {currentPlayers: currentPlayers + 1});
        } 
        return res.json({ request })
    } catch (err) {
        return next(err);
    }
});

//deny join request or kick a user from group
router.delete("/users/:username/groups/:id/request", authenticateJWT, ensureHost, async function (req, res, next) {
    try {
        const isAcceptedRequest = (await Member.get(req.params.username, req.params.id))
        console.log(isAcceptedRequest)
        const { currentPlayers, host } = await Group.get(req.params.id);
        if(req.params.username == host) throw new ForbiddenError()

        const isAccepted = isAcceptedRequest.isAccepted
        const request = await Member.remove(req.params.username, req.params.id);

        if(isAccepted) {
            await Group.update(req.params.id, {currentPlayers: currentPlayers - 1});
        }
        
        return res.json({ request })

    } catch (err) {
        return next(err);
    }
})

module.exports = router;