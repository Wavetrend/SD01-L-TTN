const { v2, v3, SD01L_PAYLOAD_TYPE } = require('../src/uplink')

describe("General Error Report", () => {

    let payload, expected;
    const OFFSET_ERROR_CODE = 7;
    const OFFSET_FILE = 9;
    const OFFSET_LINE = 41;

    beforeEach(() => {
        payload = {
            bytes: [
                                        // 00 - type
                SD01L_PAYLOAD_TYPE.GENERAL_ERROR_REPORT,
                0x00,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00, 0x00,             // 07 - error_code
                                        // 09 - file
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00,             // 41 - line
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: SD01L_PAYLOAD_TYPE.GENERAL_ERROR_REPORT,
                version: 0,
                sequence: 0,
                timestamp: 0,
                error_code: 0,
                file: "",
                line: 0
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

            test.each([ 0, 255, 65535 ])(
                "error_code = %p",
                (error_code) => {
                    payload.bytes[OFFSET_ERROR_CODE] = (error_code & 0xFF00) >>> 8;
                    payload.bytes[OFFSET_ERROR_CODE+1] = (error_code & 0x00FF) >>> 0;
                    expected.data.error_code = error_code;
                    expect(decodeUplink(payload)).toEqual(expected);
                }
            )

            test.each([ "", "foo.bar", "123456789+123456789+123456789+12" ])(
                "file = %p",
                (file) => {
                    for (let pos = 0; pos < file.length && pos < 32; pos++) {
                        payload.bytes[OFFSET_FILE+pos] = file.charCodeAt(pos);
                    }
                    expected.data.file = file.slice(0, 32);
                    expect(decodeUplink(payload)).toEqual(expected);
                }
            )

            test.each([ 0, 255, 65535 ])(
                "line = %p",
                (line) => {
                    payload.bytes[OFFSET_LINE] = (line & 0xFF00) >>> 8;
                    payload.bytes[OFFSET_LINE+1] = (line & 0x00FF) >>> 0;
                    expected.data.line = line;
                    expect(decodeUplink(payload)).toEqual(expected)
                }
            )
        }
    );
});