// Enable Strict mode to limit common mistakes
"use strict";

// Imports
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");
const db = require("../db");
const Group = require("./group");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

// Set Up & Tear Down
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*************************************** add */
describe("add class method", function () {
    test("works", async function () {
        // use Group.add
        const result = await Group.add({
            host: 'u1',
            title: 'new group',
            description: 'lorem ipcum',
            gameEdition: '5th',
            isActive: true,
            isRemote: false,
            maxPlayers: 4,
            isPublic: true,
            location: 'Reno, NV'
        });

        expect(result).toEqual({
            id: 2,
            host: 'u1',
            title: 'new group',
            description: 'lorem ipcum',
            gameEdition: '5th',
            isActive: true,
            isRemote: false,
            maxPlayers: 4,
            isPublic: true,
            location: 'Reno, NV'
        });
    });

    test("works without optional fields", async function () {
        // use Group.add with less data
        const result = await Group.add({
            host: 'u1',
            title: 'fun group',
        });

        expect(result).toEqual({
            id: 3,
            host: 'u1',
            title: 'fun group',
            description: null,
            gameEdition: null,
            isActive: true,
            isRemote: false,
            maxPlayers: 7,
            isPublic: true,
            location: null
        });
    });

    test("throws NotFoundError without host", async function () {
        try{
            // use Group.add without host in data
            await Group.add({
                title: 'invalid group'
            });
            fail();
        }
        catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual('No host');
        }
    });

    test("throws NotFoundError without data", async function () {
        try{
            // use Group.add without host in data
            await Group.add();
            fail();
        }
        catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual('No data');
        }
    });
});

/*************************************** findAll */
describe("findAll class method", function () {
    test("works", async function () {
        // use Group.findAll
        const result = await Group.findAll();
        expect(result).toEqual([
            {
                id: 1,
                host: 'u1',
                title: 'u1 group',
                description: 'dnd group for u1',
                gameEdition: '5th',
                isActive: true,
                isRemote: true,
                maxPlayers: 6,
                isPublic: true,
                location: 'Reno, NV'
            }
        ]);
    });
});

/*************************************** get */
describe("get class method", function () {
    test("works", async function () {
        // use Group.get on id 1
        const result = await Group.get(1);
        expect(result).toEqual({
            id: 1,
            host: 'u1',
            title: 'u1 group',
            description: 'dnd group for u1',
            gameEdition: '5th',
            isActive: true,
            isRemote: true,
            maxPlayers: 6,
            isPublic: true,
            location: 'Reno, NV'
        });
    });

    test("throws NotFoundError with invalid id", async function () {
        try{
            // use Group.get with invalid id
            await Group.get(100);
            fail();
        }
        catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toEqual(`No group: 100`);
        }
    });
});

/*************************************** update */
describe("update class method", function () {
    test("works", async function () {
        // use Group.update on id 1
        const result = await Group.update(1, {
            title: 'new title',
            description: 'new description',
            gameEdition: 'new edition',
            isActive: false,
            isRemote: false,
            maxPlayers: 8,
            isPublic: false,
            location: 'new location'
        });

        expect(result).toEqual({
            id: 1,
            host: 'u1',
            title: 'new title',
            description: 'new description',
            gameEdition: 'new edition',
            isActive: false,
            isRemote: false,
            maxPlayers: 8,
            isPublic: false,
            location: 'new location'
        });
    });

    test("works without all fields", async function () {
        // use Group.update on id 1
        const result = await Group.update(1, {
            title: 'new title',
            description: 'new description',
            gameEdition: 'new edition',
            isRemote: false,
            maxPlayers: 8,
        });

        expect(result).toEqual({
            id: 1,
            host: 'u1',
            title: 'new title',
            description: 'new description',
            gameEdition: 'new edition',
            isActive: true,
            isRemote: false,
            maxPlayers: 8,
            isPublic: true,
            location: 'Reno, NV'
        });
    });

    test("throws BadRequestError without id", async function () {
        try{
            await Group.update(null, {title: 'invalid request'});
            fail();
        }
        catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual('No id');
        }
    });

    test("throws BadRequestError without data", async function () {
        try{
            await Group.update(1);
            fail();
        }
        catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual('No data');
        }
    });
    
    test("throws NotFoundError with invalid id", async function () {
        try{
            await Group.update(100, {title: "invalid request"});
            fail();
        }
        catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toEqual('No group: 100')
        }
    })
});

/*************************************** remove */
describe("remove class method", function () {
    test("works", async function () {
        // use Group.remove on 1
        const removed = await Group.remove(1);
        expect(removed).toEqual(undefined);

        try{
            await Group.get(1);
        }
        catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("throws NotFoundError with invalid id", async function () {
        try{
            await Group.get(100);
            fail();
        }
        catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
