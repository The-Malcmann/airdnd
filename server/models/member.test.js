"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Member = require("./member.js");
const Group = require("./group.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Add", function () {
    test("works", async function () {
        const newMember = await Member.add('admin', 1);
        expect(newMember).toEqual({ userId: 'admin', groupId: 1 });
    })
    test("bad request if userId or groupId not provided", async function () {
        try {
            await Member.add(1);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})
describe("findAllMemberForGroup", function () {
    test("pending works", async function () {
        const newMember = await Member.add('admin', 1);
        const pendingMembers = await Member.findAllMembersForGroup(1, false);
        expect(pendingMembers[0]).toEqual({ userId: 'admin', groupId: 1, isAccepted: false, isDm: false });
    })
    
    test("accepted works", async function () {
        const activeMembers = await Member.findAllMembersForGroup(1, true);
        expect(activeMembers[0]).toEqual({ userId: 'u1', groupId: 1, isAccepted: true, isDm: true });
    })
})
describe("findAllGroupsForMembers", function () {
    test("pending works", async function () {
        const newMember = await Member.add('admin', 1);
        const pendingMembers = await Member.findAllGroupsForMember('admin', false);
        expect(pendingMembers[0]).toEqual({ userId: 'admin', groupId: 1, isAccepted: false, isDm: false });
    })
    
    test("accepted works", async function () {
        const activeMembers = await Member.findAllGroupsForMember('u1', true);
        expect(activeMembers[0]).toEqual({ userId: 'u1', groupId: 1, isAccepted: true, isDm: true });
    })
})

describe("get", function() {
    test("works", async function () {
        const member = await Member.get('u1', 1);
        expect(member).toEqual({ userId: 'u1', groupId: 1, isAccepted: true, isDm: true })
    })
    test("not found error if member can't be found", async function () {
        try {
            await Member.get('u3', 1);
        } catch (err) {
            expect (err instanceof NotFoundError).toBeTruthy()
        }
    })
})

describe("update", function () {
    test("update is_accepted works", async function () {
        const updatedMember = await Member.update('u1', 1, {isAccepted: false});
        expect(updatedMember).toEqual({userId: 'u1', groupId: 1, isAccepted: false, isDm: true})
    })
    test("update is_dm works", async function () {
        const updatedMember = await Member.update('u1', 1, {isDm: false});
        expect(updatedMember).toEqual({userId: 'u1', groupId: 1, isAccepted: true, isDm: false})
    })
    test("update both works", async function () {
        const updatedMember = await Member.update('u1', 1, {isAccepted: false, isDm: false});
        expect(updatedMember).toEqual({userId: 'u1', groupId: 1, isAccepted: false, isDm: false})
    })
    test("bad request if data is not provided", async function () {
        try {
            await Member.update('u1', 1, {});
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
    test("not found error if member can't be found", async function () {
        try {
            await Member.update('u3', 1, {isDm: false});
        } catch (err) {
            expect (err instanceof NotFoundError).toBeTruthy()
        }
    })
})

describe("remove", function () {
    test("works", async function () {
        const removedMember = await Member.remove('u1', 1);
        expect(removedMember).toEqual({userId: 'u1', groupId: 1})
    })
    test("not found error if member can't be found", async function () {
        try {
            await Member.remove('u3', 1);
        } catch (err) {
            expect (err instanceof NotFoundError).toBeTruthy()
        }
    })
})