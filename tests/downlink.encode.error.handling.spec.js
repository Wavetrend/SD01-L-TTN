const { v2, v3 } = require('../src/downlink.js');

describe("Encoder Error Handling", () => {

    let payload, expected;

    beforeEach(() => {
        payload = {
            data: {
                type: 0,
                version: 0,
                sequence: 0,
                timestamp: 0,
            },
        };

        expected = {
            warnings: [],
            errors: [],
        };
    })

    describe.each`
        type    | name                          | error
        ${0}    | ${"Install Request"}          | ${"Unsupported type for downlink encoding"}
        ${2}    | ${"Install Response"}         | ${"Unsupported type for downlink encoding"}
        ${3}    | ${"Standard Report"}          | ${"Unsupported type for downlink encoding"}
        ${4}    | ${"Ambient Report"}           | ${"Unsupported type for downlink encoding"}
        ${5}    | ${"Scald Report"}             | ${"Unsupported type for downlink encoding"}
        ${6}    | ${"Freeze Report"}            | ${"Unsupported type for downlink encoding"}
        ${7}    | ${"Low Battery Deprecated"}   | ${"Unsupported type for downlink encoding"}
        ${8}    | ${"Sensor Error Report"}      | ${"Unsupported type for downlink encoding"}
        ${9}    | ${"General Error Report"}     | ${"Unsupported type for downlink encoding"}
        ${10}   | ${"Sensor Data Debug"}        | ${"Unsupported type for downlink encoding"}
        ${11}   | ${"Unrecognised"}             | ${"Unrecognised type for downlink encoding"}
    `(
        "Encoding $name",
        ({ type, error }) => {

            beforeEach(() => {
                payload.data.type = type;
                expected.errors[0] = error;
            })

            test("v2 returns empty array", () => {
                expect(v2(payload.bytes, payload.fPort)).toEqual([]);
            });

            test("v3 return expected error", () => {
                let actual = v3(payload);
                expect(actual).toEqual(expected);
                expect(actual).not.toHaveProperty('bytes');
                expect(actual).not.toHaveProperty('fPort');
            })

        }
    )

});