const { v2, v3, SD01L_PAYLOAD_TYPE } = require('../src/uplink')

describe("Install Response", () => {

    let payload, expected;
    const OFFSET_ERROR_CODE = 7;

    beforeEach(() => {
        payload = {
            bytes: [
                                        // 00 - type
                SD01L_PAYLOAD_TYPE.INSTALL_RESPONSE,
                0x01,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00,                   // 07 - error
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: SD01L_PAYLOAD_TYPE.INSTALL_RESPONSE,
                version: 1,
                sequence: 0,
                timestamp: 0,
                error_code: 0,
            },
            errors: [],
            warnings: []
        };

    })

    describe.each([
        ['TTN v3', (input) => v3(input)],
        ['TTN v2', (input) => {
            return {
                data: v2(input.bytes, input.fPort),
                warnings: [],
                errors: [],
            };
        }],
    ])(
        "Decode %p",
        (name, decodeUplink) => {

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

        }
    );

});