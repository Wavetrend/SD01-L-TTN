const { v2, v3, SD01L_PAYLOAD_TYPE } = require('../src/uplink')

describe("Sensor Error Report", () => {

    let payload, expected;
    const OFFSET_SENSOR_1 = 7;

    beforeEach(() => {
        payload = {
            bytes: [
                                        // 00 - type
                SD01L_PAYLOAD_TYPE.SENSOR_ERROR_REPORT,
                0x00,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00,                   // 07 - sensor 1
                0x00,                   // 08 - sensor 2
                0x00,                   // 09 - sensor 3
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: SD01L_PAYLOAD_TYPE.SENSOR_ERROR_REPORT,
                version: 0,
                sequence: 0,
                timestamp: 0,
                sensor: [ 0, 0, 0 ],
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

            describe.each([ 1, 2, 3 ])(
                "%p",
                (sensor) => {
                    test.each([ 0, 255 ])(
                        "code = %p",
                        (code) => {
                            payload.bytes[OFFSET_SENSOR_1 + (sensor - 1)] = code;
                            expected.data.sensor[sensor - 1] = code;
                            expect(decodeUplink(payload)).toEqual(expected)
                        }
                    )
                }
            )
        }
    );
});