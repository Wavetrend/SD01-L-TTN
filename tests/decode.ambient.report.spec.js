const { v2, v3, SD01L_PAYLOAD_TYPE } = require('../src/uplink')

describe("Ambient Report", () => {

    let payload, expected;
    const OFFSET_MINC = 7;
    const OFFSET_MAXC = 8;
    const OFFSET_AVGC = 9;

    beforeEach(() => {
        payload = {
            bytes: [
                                        // 00 - type
                SD01L_PAYLOAD_TYPE.AMBIENT_REPORT,
                0x00,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00,                   // 07 - minC
                0x00,                   // 08 - maxC
                0x00,                   // 09 - avgC
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: SD01L_PAYLOAD_TYPE.AMBIENT_REPORT,
                version: 0,
                sequence: 0,
                timestamp: 0,
                minC: 0,
                maxC: 0,
                avgC: 0,
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

            describe.each([
                ['minC', OFFSET_MINC ],
                ['maxC', OFFSET_MAXC ],
                ['avgC', OFFSET_AVGC ],
            ])(
                "%p",
                (keyword, offset) => {
                    test.each([ -27, 0, 20, 100 ])(
                        "tempC = %p",
                        (tempC) => {
                            payload.bytes[offset] = (tempC & 0xFF) >>> 0;
                            expected.data[keyword] = tempC;
                            expect(decodeUplink(payload)).toEqual(expected);
                        }
                    )
                }
            )
        }
    );
});