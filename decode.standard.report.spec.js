const decodeUplink = require('./decoder')

describe("Standard Report", () => {

    let payload, expected;

    beforeEach(() => {
        payload = {
            bytes: [
                0x03,                   // 00 - type standard report
                0x01,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: 3,
                version: 1,
                sequence: 0,
                timestamp: 0,
            },
            errors: [],
            warnings: []
        };

    })

    test('base line', () => {
        expect(decodeUplink(payload)).toEqual(expected);
    });

});