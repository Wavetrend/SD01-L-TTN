const { v2, v3 } = require('./decoder')

describe("Error Handling", () => {

    let payload, expected;

    beforeEach(() => {
        payload = {
            bytes: [
                0x00,                   // 00 - type
                0x00,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
            ],
            fPort: 1
        };

        expected = {
            errors: [],
            warnings: []
        };

    })

    describe.each`
        type    | name                    | error
        ${1}    | ${"Configuration"}      | ${"Configuration type is not a valid uplink message"}
        ${7}    | ${"Low Battery Report"} | ${"Low Battery Report is deprecated"}
        ${10}   | ${"Sensor Data Debug"}  | ${"Sensor Data Debug is not supported for decode"}
        ${11}   | ${"Unrecognised Type"}  | ${"Unrecognised Type Code"}
    `(
        "Decoding $name",
        ({ type, error }) => {

            beforeEach(() => {
                payload.bytes[0] = type;
                expected.errors[0] = error;
            })

            test("v2 returns null", () => {
                expect(v2(payload.bytes, payload.fPort)).toBeNull();
            })
            test("v3 return expected error", () => {
                expect(v3(payload)).toEqual(expected);
            })

        }
    )
});