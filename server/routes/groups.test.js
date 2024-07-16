// Enable strict mode
"use strict";

// Imports
const request = require("supertest");
const db = require("../db");
const app = require("../app");
const Group = require("../models/group");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    adminToken,
    u1Token
} = require("./_testCommon");

// Set Up & Tear Down
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************************** POST /groups */
describe("POST /groups", function () {
    test("works", async function () {
        const res = await request(app)
            .post("/groups")
            .send({
                host: "u3",
                title: "u3's group"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            group: {
                id: 2,
                host: "u3",
                title: "u3's group",
                description: null,
                gameEdition: null,
                isActive: true,
                isRemote: false,
                maxPlayers: 7,
                isPublic: true,
                location: null,
                currentPlayers: 1
            }
        });
    });

    test("throws BadRequestErrors if not valid", async function () {
        const res = await request(app)
            .post("/groups")
            .send({ username: "fakeName" })
            .set("authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(400);
    });
});

/****************************** GET /groups */
describe("GET /groups", function () {
    test("works", async function () {
        const res = (await request(app).get("/groups"));

        expect(res.body).toEqual({
            groups: [
                {
                    id: 1,
                    host: "u1",
                    title: "u1's group",
                    description: "this is gonna be an intense hardcore mode style game, so gear up",
                    gameEdition: "5th",
                    isActive: true,
                    isRemote: true,
                    maxPlayers: 6,
                    isPublic: true,
                    location: null,
                    currentPlayers: 3
                }
            ]
        });
    });
});

/****************************** GET /groups/:id */
describe("GET /groups/:id", function () {
    test("works", async function () {
        const res = await request(app).get('/groups/1');

        expect(res.body).toEqual({
            group: {
                id: 1,
                host: "u1",
                title: "u1's group",
                description: "this is gonna be an intense hardcore mode style game, so gear up",
                gameEdition: "5th",
                isActive: true,
                isRemote: true,
                maxPlayers: 6,
                isPublic: true,
                location: null,
                currentPlayers: 3
            }
        });
    });
});

/****************************** PATCH /groups/:id */
describe("PATCH /groups/:id", function () {
    test("works", async function () {
        const res = await request(app)
            .patch("/groups/1")
            .send({
                host: 'u1',
                title: "new title",
                description: "new description",
                gameEdition: "3.5",
                isRemote: false,
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual({
            group: {
                id: 1,
                host: "u1",
                title: "new title",
                description: "new description",
                gameEdition: "3.5",
                isActive: true,
                isRemote: false,
                maxPlayers: 6,
                isPublic: true,
                location: null,
                currentPlayers: 3
            }
        });
    });
});

/****************************** DELETE /groups/:id */
describe("DELETE /groups/:id", function () {
    test("works", async function () {
        const res = await request(app)
            .delete("/groups/1")
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(res.body).toEqual({
            message: "Group 1 removed."
        })
    });
})