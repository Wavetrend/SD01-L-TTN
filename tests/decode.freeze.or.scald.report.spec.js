const { v2, v3, SD01L_PAYLOAD_TYPE } = require('../src/decoder')

describe("Freeze/Scald Report", () => {

    let payload, expected;
    const OFFSET_SENSOR = 7;
    const OFFSET_TEMPERATURE = 8;

    describe.each`
        name            | type                                   | version
        ${'Freeze'}     | ${SD01L_PAYLOAD_TYPE.FREEZE_REPORT}    | ${1}
        ${'Scald'}      | ${SD01L_PAYLOAD_TYPE.SCALD_REPORT}     | ${1}
    `(
        "$name",
        ({ type, version }) => {
            beforeEach(() => {
                payload = {
                    bytes: [
                        type,                   // 00 - type freeze or scald
                        version,                // 01 - version
                        0x00,                   // 02 - sequence
                        0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                        0x00,                   // 07 - sensor
                        0x00,                   // 08 - temperature
                    ],
                    fPort: 1
                };

                expected = {
                    data: {
                        type: type,
                        version: version,
                        sequence: 0,
                        timestamp: 0,
                        sensor: 0,
                        temperature: 0,
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
                        "sensor = %p",
                        (sensor) => {
                            test.each([ -27, 0, 20, 100 ])(
                                "temperature = %p",
                                (tempC) => {
                                    payload.bytes[OFFSET_SENSOR] = sensor - 1;
                                    payload.bytes[OFFSET_TEMPERATURE] = tempC;
                                    expected.data.sensor = sensor - 1;
                                    expected.data.temperature = tempC;
                                    expect(decodeUplink(payload)).toEqual(expected);
                                }
                            )
                        }
                    )
                }
            );
        }
    )
});