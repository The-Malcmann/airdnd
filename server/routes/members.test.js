"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

const Member = require("../models/member");
const Group = require("../models/group");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("/members/users/:username/active", function () {
    test("works", async function () {
        const resp = await request(app)
        .get("/members/users/u1/active")
        .set("authorization", `Bearer ${adminToken}`);
    
        expect(resp.body).toEqual({
            groups: [
                {
                    groupId: 1,
                    userId: 'u1',
                    isAccepted: true,
                    isDm: false
                }
            ]
        })
    })
    test("works for same user", async function () {
        const resp = await request(app)
        .get("/members/users/u1/active")
        .set("authorization", `Bearer ${u1Token}`);
    
        expect(resp.body).toEqual({
            groups: [
                {
                    groupId: 1,
                    userId: 'u1',
                    isAccepted: true,
                    isDm: false
                }
            ]
        })
    })
})
describe("/members/users/:username/pending", function () {
    test("works", async function () {
        const resp = await request(app)
        .get("/members/users/u2/pending")
        .set("authorization", `Bearer ${adminToken}`);
    
        expect(resp.body).toEqual({
            groups: [
                {
                    groupId: 1,
                    userId: 'u2',
                    isAccepted: false,
                    isDm: false
                }
            ]
        })
    })
    test("works for same user", async function () {
        const resp = await request(app)
        .get("/members/users/u2/pending")
        .set("authorization", `Bearer ${u1Token}`);
    
        expect(resp.body).toEqual({
            groups: [
                {
                    groupId: 1,
                    userId: 'u2',
                    isAccepted: false,
                    isDm: false
                }
            ]
        })
    })
})

// Gets active members for a given group
describe("/members/groups/:id/", function () {
    test("works", async function () {
        const resp = await request(app)
        .get("/members/groups/1")
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            activeMembers: [
                {
                    groupId: 1,
                    isAccepted: true,
                    isDm: false,
                    userId: 'u1'
                }
            ],
            pendingMembers: [
                {
                    groupId: 1,
                    isAccepted: false,
                    isDm: false,
                    userId: 'u2'
                }
            ]
        })


    })
})

// Request, Approve, and Deny logic
describe("/members/users/:username/groups/:id/request", function () {
    // approve request
    test("patch works", async function () {
       
        const resp = await request(app)
        .patch("/members/users/u2/groups/1/request")
        .set("authorization", `Bearer ${u1Token}`);
        expect (resp.body).toEqual({
            request: {
                userId: "u2",
                groupId: 1,
                isAccepted: true,
                isDm: false
            }
        })
        expect(resp.statusCode).toEqual(200);
      

    })
    // approve request connected as not the host of that group
    test("patch fails if connected token is not host", async function () {
        const resp = await request(app)
        .patch("/members/users/u2/groups/1/request")
        .set("authorization", `Bearer ${u2Token}`);
        
        expect(resp.statusCode).toEqual(401);
    })
    // request to join a group
    test("post works", async function () {
        const currentPlayers = (await Group.get(1)).currentPlayers
        const resp = await request(app)
        .post("/members/users/u3/groups/1/request")
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.body).toEqual({
            request: {
                groupId: 1,
                userId: 'u3'
            }
        })
        const newCurrentPlayers = (await Group.get(1)).currentPlayers

        expect(newCurrentPlayers - currentPlayers).toEqual(1)
    })
    test("reject request works", async function () {
        //request to join group 1
        const joinRequest = await request(app)
        .post("/members/users/u3/groups/1/request")
        .set("authorization", `Bearer ${u2Token}`);
        
        const currentPlayers = (await Group.get(1)).currentPlayers
        
        const resp = await request(app)
        .delete("/members/users/u3/groups/1/request")
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            request: {
                userId: 'u3',
                groupId: 1
            }
        })
        const newCurrentPlayers = (await Group.get(1)).currentPlayers
        expect(newCurrentPlayers - currentPlayers).toEqual(-1)

    })
    test("kick member works", async function () {
        //request to join group 1
        const resp = await request(app)
        .delete("/members/users/u2/groups/1/request")
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            request: {
                userId: 'u2',
                groupId: 1
            }
        })
    })
    test("reject request fails when connected user is not host", async function () {
        const joinRequest = await request(app)
        .post("/members/users/u3/groups/1/request")
        .set("authorization", `Bearer ${u2Token}`);

        const resp = await request(app)
        .delete("/members/users/u3/groups/1/request")
        .set("authorization", `Bearer ${u2Token}`);

        expect(resp.statusCode).toEqual(401)
    })
})
