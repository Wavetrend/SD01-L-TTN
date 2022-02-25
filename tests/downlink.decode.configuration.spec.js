const { decodeDownlink }= require('../src/downlink');

describe("Decode Configuration", () => {

    let payload, expected;
    const OFFSET_NONCE = 7;
    const OFFSET_DOWNLINK_HOURS = 11;
    const OFFSET_MESSAGE_FLAGS = 12;
    const OFFSET_SCALD_THRESHOLD = 13;
    const OFFSET_FREEZE_THRESHOLD = 14;
    const OFFSET_REPORTING_PERIOD = 15;
    const OFFSET_CONFIGS = 17;

    beforeEach(() => {
        payload = {
            bytes: [
                0x01,                       // 00 - type
                0x03,                       // 01 - version
                0x00,                       // 02 - sequence
                0x00, 0x00, 0x00, 0x00,     // 03 - timestamp
                0x00, 0x00, 0x00, 0x00,     // 07 - nonce
                0x00,                       // 11 - downlink_hours
                0x00,                       // 12 - message flags
                0x00,                       // 13 - scald threshold
                0x00,                       // 14 - freeze threshold
                0x00, 0x00,                 // 15 - reporting period
                0x00,                       // 17 - sensor 1 config
                0x00,                       // 18 - sensor 2 config
                0x00,                       // 19 - sensor 3 config
            ],
            fPort: 1,
        };

        expected = {
            data: {
                type: 1,
                version: 3,
                sequence: 0,
                timestamp: 0,
                nonce: 0,
                downlink_hours: 0,
                message_flags: {
                    scald: false,
                    freeze: false,
                    ambient: false,
                    debug: false,
                    history_count: 0,
                },
                scald_threshold: 0,
                freeze_threshold: 0,
                reporting_period: 0,
                config_type: [
                    {
                        flow_settling_count: 0,
                        config: 0,
                    },
                    {
                        flow_settling_count: 0,
                        config: 0,
                    },
                    {
                        flow_settling_count: 0,
                        config: 0,
                    },
                ],
            },
            errors: [],
            warnings: [],
        };
    });

    test("base line", () => {
        expect(decodeDownlink(payload)).toEqual(expected);
    });

    test.each([ 0, 0x12345678, 0xFFFFFFFF ])(
        "nonce = %p",
        (nonce) => {
            payload.bytes[OFFSET_NONCE] = (nonce & 0xFF000000) >>> 24;
            payload.bytes[OFFSET_NONCE+1] = (nonce & 0x00FF0000) >>> 16;
            payload.bytes[OFFSET_NONCE+2] = (nonce & 0x0000FF00) >>> 8;
            payload.bytes[OFFSET_NONCE+3] = (nonce & 0x000000FF);
        }
    );

    test.each([ 1, 24, 255 ])(
        "downlink hours = %p",
        (hours) => {
            payload.bytes[OFFSET_DOWNLINK_HOURS] = (hours & 0xFF) >>> 0;
            expected.data.downlink_hours = hours;
            expect(decodeDownlink(payload)).toEqual(expected)
        }
    );

    test.each`
        flag            | offset
        ${'scald'}      | ${0}
        ${'freeze'}     | ${1}
        ${'ambient'}    | ${2}
        ${'debug'}      | ${3}
    `(
        "message_flag: $flag",
        ({flag, offset}) => {
            payload.bytes[OFFSET_MESSAGE_FLAGS] = 1 << offset >>> 0;
            expected.data.message_flags[flag] = true;
            expect(decodeDownlink(payload)).toEqual(expected)
        }
    );

    test.each([ 0, 1, 2 ])(
        "message_flags: history_count",
        (count) => {
            payload.bytes[OFFSET_MESSAGE_FLAGS] = (count & 0x03) << 6 >>> 0;
            expected.data.message_flags.history_count = count;
            expect(decodeDownlink(payload)).toEqual(expected)
        }
    );

    describe.each`
        name                  | offset
        ${'scald_threshold'}  | ${OFFSET_SCALD_THRESHOLD}
        ${'freeze_threshold'} | ${OFFSET_FREEZE_THRESHOLD}
    `(
        "$name",
        ({name, offset}) => {
            test.each([ -127, 0, 127 ])(
                "threshold = %p",
                (threshold) => {
                    payload.bytes[offset] = (threshold & 0xFF) >>> 0;
                    expected.data[name] = threshold;
                    expect(decodeDownlink(payload)).toEqual(expected)
                }
            );
        }
    );

    test.each([0, 255])(
        "reporting period = %p",
        (period) => {
            payload.bytes[OFFSET_REPORTING_PERIOD] = (period & 0xFF00) << 8 >>> 0;
            payload.bytes[OFFSET_REPORTING_PERIOD+1] = (period & 0x00FF) >>> 0;
            expected.data.reporting_period = period;
            expect(decodeDownlink(payload)).toEqual(expected)
        }
    );

    describe.each([ 1, 2, 3 ])(
        "config_type: sensor %p",
        (sensor) => {
            test.each([0, 15])(
                "flow_settling_count = %p",
                (count) => {
                    payload.bytes[OFFSET_CONFIGS+(sensor-1)] = (count & 0x0F) << 4 >>> 0;
                    expected.data.config_type[sensor-1].flow_settling_count = count;
                    expect(decodeDownlink(payload)).toEqual(expected)
                }
            );

            test.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 15])(
                "config = %p",
                (config) => {
                    payload.bytes[OFFSET_CONFIGS+(sensor-1)] = (config & 0x0F) >>> 0;
                    expected.data.config_type[sensor-1].config = config;
                    expect(decodeDownlink(payload)).toEqual(expected)
                }
            );
        }
    );
});