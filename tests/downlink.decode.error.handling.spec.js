const { decodeDownlink, SD01L_PAYLOAD_TYPE } = require('../src/downlink.js');

describe("Encoder Error Handling", () => {

    let payload, expected;

    beforeEach(() => {
        payload = {
            bytes: [
                0x00,                       // 00 - type
                0x00,                       // 01 - version
                0x00,                       // 02 - sequence
                0x00, 0x00, 0x00, 0x00,     // 03 - timestamp
            ]
        };

        expected = {
            warnings: [],
            errors: [],
        };
    })

    describe.each`
        type    | name                          | error
        ${0}    | ${"Install Request"}          | ${"Unsupported type for downlink decoding"}
        ${2}    | ${"Install Response"}         | ${"Unsupported type for downlink decoding"}
        ${3}    | ${"Standard Report"}          | ${"Unsupported type for downlink decoding"}
        ${4}    | ${"Ambient Report"}           | ${"Unsupported type for downlink decoding"}
        ${5}    | ${"Scald Report"}             | ${"Unsupported type for downlink decoding"}
        ${6}    | ${"Freeze Report"}            | ${"Unsupported type for downlink decoding"}
        ${7}    | ${"Low Battery Deprecated"}   | ${"Unsupported type for downlink decoding"}
        ${8}    | ${"Sensor Error Report"}      | ${"Unsupported type for downlink decoding"}
        ${9}    | ${"General Error Report"}     | ${"Unsupported type for downlink decoding"}
        ${10}   | ${"Sensor Data Debug"}        | ${"Unsupported type for downlink decoding"}
        ${11}   | ${"Unrecognised"}             | ${"Unrecognised type for downlink decoding"}
    `(
        "Encoding $name",
        ({ type, error }) => {

            beforeEach(() => {
                payload.bytes[0] = type;
                expected.errors[0] = error;
            })

            test("decodeDownlink return expected error", () => {
                let actual = decodeDownlink(payload);
                expect(actual).toEqual(expected);
                expect(actual).not.toHaveProperty('bytes');
                expect(actual).not.toHaveProperty('fPort');
            })

        }
    );

    describe.each([ 0, 1, 2, 4 ])(
        "Configuration version = %p",
        (version) => {
            beforeEach(() => {
                payload.bytes[0] = SD01L_PAYLOAD_TYPE.CONFIGURATION;
                payload.bytes[1] = version;
                expected.errors.push("Unsupported configuration version " + version);
            });

            test("decodeDownlink returns error", () => {
                expect(decodeDownlink(payload)).toEqual(expected);
            });

        }
    );

});