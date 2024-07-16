// Enable strict mode to catch common mistakes
"use strict";

// Imports
const config = require('./config');

describe("config can come from env", function () {
    test('should contain SECRET_KEY', function () {
        expect(config).toHaveProperty('SECRET_KEY');
        expect(typeof config.SECRET_KEY).toBe('string');
    })

    test('should contain BCRYPT_WORK_FACTOR', function () {
        expect(config).toHaveProperty('BCRYPT_WORK_FACTOR');
        expect(typeof config.BCRYPT_WORK_FACTOR).toBe('number');
    })

    test('getDatabaseUri should return a string', () => {
        expect(typeof config.getDatabaseUri()).toBe('string');
    })

    test('getDatabaseUri should return a test database uri', function () {
        // set app env to test
        process.env.NODE_ENV = 'test';
        expect(config.getDatabaseUri()).toBe('postgres://malcolm:Horses%535772@localhost:5432/airdnd_test');
    })

    test('getDatabaseUri should return main database uri in non-test enviornments', function () {
        // set app env to not test
        process.env.NODE_ENV = 'production';
        expect(config.getDatabaseUri()).toBe('postgres://malcolm:Horses%535772@localhost:5432/airdnd');
    })
})
 