const { Encoder: v2, encodeDownlink: v3, SD01L_PAYLOAD_TYPE } = require('../src/downlink.js');

describe("Configuration", () => {

    let payload, expected;
    const OFFSET_NONCE = 7;
    const OFFSET_DOWNLINK_HOURS = 11;
    const OFFSET_MESSAGE_FLAGS = 12;
    const OFFSET_SCALD_THRESHOLD = 13;
    const OFFSET_FREEZE_THRESHOLD = 14;
    const OFFSET_REPORTING_PERIOD = 15;
    const OFFSET_SENSOR_CONFIG = 17;

    describe.each([
        [3, (input) => v3(input)],
        [2, (input) => {
            return {
                bytes: v2(input.data),
                fPort: 1,
                warnings: [],
                errors: [],
            };
        }],
    ])(
        "TTN v%p",
        (ttnVersion, encodeDownlink) => {

            beforeEach(() => {
                payload = {
                    data: {
                        type: SD01L_PAYLOAD_TYPE.CONFIGURATION,
                        version: 3,
                        sequence: 0,
                        timestamp: 0,
                        // NB: Encoder copes with missing properties by supplying defaults
                    },
                };

                expected = {
                    bytes: [
                                                    // 00 - type
                        SD01L_PAYLOAD_TYPE.CONFIGURATION,
                        0x03,                       // 01 - version
                        0x00,                       // 02 - sequence
                        0x00, 0x00, 0x00, 0x00,     // 03 - timestamp
                        0x00, 0x00, 0x00, 0x00,     // 07 - nonce
                        24,                         // 11 - downlink hours
                        0x00,                       // 12 - message flags
                        60,                         // 13 - scald threshold
                        4,                          // 14 - freeze threshold
                        0x00, 60,                   // 15 - reporting period
                        0x00, 0x00, 0x00            // 16 - sensor configs
                    ],
                    fPort: 1,
                    warnings: [],
                    errors: [],
                };
            })

            test("base line", () => {
                expect(encodeDownlink(payload)).toEqual(expected);
            });

            test.each([ 0, 1, 2, 4, 255 ])(
                "incorrect version",
                (version) => {
                payload.data.version = version;
                switch (ttnVersion) {
                    case 2:
                        expected.bytes = [];
                        break;
                    case 3:
                        expected.errors.push(`Unsupported configuration version ${version}`);
                        delete expected.bytes;
                        delete expected.fPort;
                        break;
                }
                expect(encodeDownlink(payload)).toEqual(expected);
            });

            test.each([ 0, 0x12345678, 0xFFFFFFFF ])(
                "nonce = %p",
                (nonce) => {
                    payload.data.nonce = nonce;
                    expected.bytes[OFFSET_NONCE] = (nonce & 0xFF000000) >>> 24;
                    expected.bytes[OFFSET_NONCE+1] = (nonce & 0x00FF0000) >>> 16;
                    expected.bytes[OFFSET_NONCE+2] = (nonce & 0x0000FF00) >>> 8;
                    expected.bytes[OFFSET_NONCE+3] = nonce & 0x000000FF;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            );

            test.each([ 0, 24, 255 ])(
                "downlink_hours = %p",
                (hours) => {
                    payload.data.downlink_hours = hours;
                    expected.bytes[OFFSET_DOWNLINK_HOURS] = hours & 0xFF;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            );

            test.each`
                flag                    | bit
                ${'scald'}              | ${0}
                ${'freeze'}             | ${1}
                ${'ambient'}            | ${2}
                ${'debug'}              | ${3}
            `(
                "message flag: $flag",
                ({ flag, bit }) => {
                    payload.data.message_flags = payload.data.message_flags || {};
                    payload.data.message_flags[flag] = true;
                    expected.bytes[OFFSET_MESSAGE_FLAGS] = 2 ** bit;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            );

            test.each([ 0, 1, 2 ])(
                "message flag: history count = %p",
                (count) => {
                    payload.data.message_flags = payload.data.message_flags || {};
                    payload.data.message_flags.history_count = count;
                    expected.bytes[OFFSET_MESSAGE_FLAGS] = (count & 0x03) << 5 >>> 0;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            );

            test.each( [ -27, 0, 4, 100 ])(
                "scald threshold = %p",
                (threshold) => {
                    payload.data.scald_threshold = threshold;
                    expected.bytes[OFFSET_SCALD_THRESHOLD] = (threshold & 0xFF) >>> 0;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            )

            test.each( [ -27, 0, 4, 100 ])(
                "freeze threshold = %p",
                (threshold) => {
                    payload.data.freeze_threshold = threshold;
                    expected.bytes[OFFSET_FREEZE_THRESHOLD] = (threshold & 0xFF) >>> 0;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            )

            test.each( [ 0, 60, 1440, 65535 ])(
                "reporting period = %p",
                (period) => {
                    payload.data.reporting_period = period;
                    expected.bytes[OFFSET_REPORTING_PERIOD] = (period & 0xFF00) >>> 8;
                    expected.bytes[OFFSET_REPORTING_PERIOD+1] = period & 0x00FF;
                    expect(encodeDownlink(payload)).toEqual(expected);
                }
            );

            describe.each([ 1, 2, 3 ])(
                "Sensor %p config",
                (sensor) => {

                    describe.each([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ])(
                        "config type = %p",
                        (config) => {

                            test.each([0, 5, 15])(
                                "flow throttling count = %p",
                                (count) => {
                                    payload.data.config_type = payload.data.config_type || [];
                                    payload.data.config_type[sensor-1] = payload.data.config_type[sensor-1] || {}
                                    payload.data.config_type[sensor-1].config = config;
                                    payload.data.config_type[sensor-1].flow_settling_count = count;
                                    expected.bytes[OFFSET_SENSOR_CONFIG + (sensor-1)] =
                                        (count & 0x0F) << 4 >>> 0 | config & 0x0F;
                                    expect(encodeDownlink(payload)).toEqual(expected);
                                }
                            )
                        }
                    )
                }
            )
        }
    );

});