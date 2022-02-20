const decodeUplink = require('./decoder')

describe("Install Response", () => {

    let payload, expected;
    const OFFSET_ERROR_CODE = 7;

    beforeEach(() => {
        payload = {
            bytes: [
                0x02,                   // 00 - type install response
                0x03,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00,                   // 07 - error
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: 2,
                version: 3,
                sequence: 0,
                timestamp: 0,
                error_code: 0,
            },
            errors: [],
            warnings: []
        };

    })

    test('base line', () => {
        expect(decodeUplink(payload)).toEqual(expected);
    });

    test.each([ 0, 15, 255 ])(
        "with error code = %p",
        (error_code) => {
            payload.bytes[OFFSET_ERROR_CODE] = error_code;
            expected.data.error_code = error_code;
            expect(decodeUplink(payload)).toEqual(expected);
        }
    )

});