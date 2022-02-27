const { Decoder: v2, decodeUplink: v3,  SD01L_PAYLOAD_TYPE } = require('../src/uplink')

describe('Install Request', () => {

    let payload, expected
    const OFFSET_SEQUENCE = 2
    const OFFSET_TIMESTAMP = 3
    const OFFSET_NONCE = 7
    const OFFSET_BATTERY_MV = 11
    const OFFSET_SENSOR_1_TEMP = 13
    // const OFFSET_SENSOR_2_TEMP = 15
    // const OFFSET_SENSOR_3_TEMP = 17
    const OFFSET_VERSION_MAJOR = 19
    const OFFSET_VERSION_MINOR = 20
    const OFFSET_VERSION_BUILD = 21
    const OFFSET_RESET_REASON = 23

    beforeEach(() => {
        payload = {
            bytes: [
                                        // 00 - type
                SD01L_PAYLOAD_TYPE.INSTALL_REQUEST,
                0x04,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00, 0x00, 0x00, 0x00, // 07 - nonce
                0x00, 0x00,             // 11 - battery mV
                0x01, 0x0E,             // 13 - sensor 1 temp (0degC)
                0x01, 0x0E,             // 15 - sensor 2 temp (0degC)
                0x01, 0x0E,             // 17 - sensor 3 temp (0degC)
                0x00, 0x00, 0x00, 0x00, // 19 - version
                0x00, 0x00,             // 23 - reset reason
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: SD01L_PAYLOAD_TYPE.INSTALL_REQUEST,
                version: 4,
                sequence: 0,
                timestamp: 0,
                nonce: 0,
                battery_mV: 0,
                temperature: [
                    0, 0, 0
                ],
                firmware_version: {
                    major: 0,
                    minor: 0,
                    build: 0,
                },
                reset_reason: 0
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

            test('with max sequence', () => {
                payload.bytes[OFFSET_SEQUENCE] = 0xFF;
                expected.data.sequence = 255;
                expect(decodeUplink(payload)).toEqual(expected);
            });

            test.each([ 0xFFFFFFFF, 1645197794 ])(
                "with timestamp = %p",
                (timestamp) => {
                    payload.bytes[OFFSET_TIMESTAMP] = (timestamp & 0xFF000000) >>> 24;
                    payload.bytes[OFFSET_TIMESTAMP+1] = (timestamp & 0x00FF0000) >>> 16;
                    payload.bytes[OFFSET_TIMESTAMP+2] = (timestamp & 0x0000FF00) >>> 8;
                    payload.bytes[OFFSET_TIMESTAMP+3] = (timestamp & 0xFF) >>> 0;
                    expected.data.timestamp = timestamp;
                    expect(decodeUplink(payload)).toEqual(expected);
                }
            );

            test.each([ 0xFFFFFFFF, 0x12345678 ])(
                "with nonce = %p",
                (nonce) => {
                    payload.bytes[OFFSET_NONCE] = (nonce & 0xFF000000) >>> 24;
                    payload.bytes[OFFSET_NONCE+1] = (nonce & 0x00FF0000) >>> 16;
                    payload.bytes[OFFSET_NONCE+2] = (nonce & 0x0000FF00) >>> 8;
                    payload.bytes[OFFSET_NONCE+3] = (nonce & 0x000000FF) >>> 0;
                    expected.data.nonce = nonce;
                    expect(decodeUplink(payload)).toEqual(expected);
                }
            );

            test.each([ 1850, 2040, 2240, 2440, 2640, 2830, 3050, 3300, 3600 ])(
                "with battery mV = %p",
                (mv) => {
                    payload.bytes[OFFSET_BATTERY_MV] = (mv & 0xFF00) >>> 8;
                    payload.bytes[OFFSET_BATTERY_MV+1] = (mv & 0x00FF) >>> 0;
                    expected.data.battery_mV = mv;
                    expect(decodeUplink(payload)).toEqual(expected);
                }
            )

            // Test each sensor with expected values
            describe.each([1, 2, 3])(
                "sensor %p",
                (sensor) => {
                    test.each([-27, 0, 20, 100])(
                        `with sensor ${sensor+1} temp = %p`,
                        (temp) => {
                            const index = (sensor - 1) * 2;
                            payload.bytes[OFFSET_SENSOR_1_TEMP + index] = (((temp + 27) * 10) & 0xFF00) >>> 8
                            payload.bytes[OFFSET_SENSOR_1_TEMP + index + 1] = (((temp + 27) * 10) & 0x00FF) >>> 0;
                            expected.data.temperature[sensor-1] = temp;
                            expect(decodeUplink(payload)).toEqual(expected);
                        }
                    )

                }
            )

            describe.each`
                field           | position                  | width | values
                ${'major'}      | ${OFFSET_VERSION_MAJOR}   | ${1}  | ${[0, 127, 255]}
                ${'minor'}      | ${OFFSET_VERSION_MINOR}   | ${1}  | ${[0, 127, 255]}
                ${'build'}      | ${OFFSET_VERSION_BUILD}   | ${2}  | ${[0, 255, 256, 65535]}
            `(
                "version $field",
                ({field, position, width, values}) => {
                    test.each(values)(
                        "value = %p",
                        (value) => {
                            for (let offset = 0; offset < width; offset++) {
                                let shift = (width-(offset+1))*8
                                payload.bytes[position + offset] = ((value >>> shift) & 0xFF) >>> 0;
                            }
                            expected.data.firmware_version[field] = value;
                            expect(decodeUplink(payload)).toEqual(expected);
                        }
                    )
                }
            );

            test.each([ 0, 127, 255, 256, 65535 ])(
                "with reset_reason = %p",
                (mv) => {
                    payload.bytes[OFFSET_RESET_REASON] = (mv & 0xFF00) >>> 8;
                    payload.bytes[OFFSET_RESET_REASON+1] = (mv & 0xFF) >>> 0;
                    expected.data.reset_reason = mv;
                    expect(decodeUplink(payload)).toEqual(expected);
                }
            )
        }
    );

});

