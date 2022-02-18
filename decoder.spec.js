const decodeUplink = require('./decoder')

describe('Install Request', () => {

    let payload, expected
    const OFFSET_SEQUENCE = 2
    const OFFSET_TIMESTAMP = 3
    const OFFSET_NONCE = 7
    const OFFSET_BATTERY_MV = 11
    const OFFSET_SENSOR_1_TEMP = 13
    const OFFSET_SENSOR_2_TEMP = 15
    const OFFSET_SENSOR_3_TEMP = 17
    const OFFSET_RESET_REASON = 19

    beforeEach(() => {
        payload = {
            bytes: [
                0x00,                   // 00 - type install request
                0x04,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                0x00, 0x00, 0x00, 0x00, // 07 - nonce
                0x00, 0x00,             // 11 - battery mV
                0x01, 0x0E,             // 13 - sensor 1 temp (0degC)
                0x01, 0x0E,             // 15 - sensor 2 temp (0degC)
                0x01, 0x0E,             // 17 - sensor 3 temp (0degC)
                0x00, 0x00,             // 19 - reset reason
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: 0,
                version: 4,
                sequence: 0,
                timestamp: 0,
                nonce: 0,
                battery_mV: 0,
                temperature: [
                    0, 0, 0
                ],
                reset_reason: 0
            },
            errors: [],
            warnings: []
        };

    })

    test('base line', () => {
        expect(decodeUplink(payload)).toEqual(expected);
    });

    test('with max sequence', () => {
        payload.bytes[OFFSET_SEQUENCE] = 0xFE;
        expected.data.sequence = 254;
        expect(decodeUplink(payload)).toEqual(expected);
    });

    test('with max nonce', () => {
        payload.bytes[OFFSET_NONCE] = 0xFF;
        payload.bytes[OFFSET_NONCE+1] = 0xFF;
        payload.bytes[OFFSET_NONCE+2] = 0xFF;
        payload.bytes[OFFSET_NONCE+3] = 0xFF;
        expected.data.nonce = 0xFFFFFFFF;
        expect(decodeUplink(payload)).toEqual(expected);
    });

    test('with arbitrary nonce', () => {
        payload.bytes[OFFSET_NONCE] = 0x12;
        payload.bytes[OFFSET_NONCE+1] = 0x34;
        payload.bytes[OFFSET_NONCE+2] = 0x56;
        payload.bytes[OFFSET_NONCE+3] = 0x78;
        expected.data.nonce = 0x12345678;
        expect(decodeUplink(payload)).toEqual(expected);
    });

    test('with min battery', () => {
        const mv = 1850;
        payload.bytes[OFFSET_BATTERY_MV] = (mv & 0xFF00) >> 8;
        payload.bytes[OFFSET_BATTERY_MV+1] = (mv & 0xFF);
        expected.data.battery_mV = mv;
        expect(decodeUplink(payload)).toEqual(expected);
    });

    test('with max battery', () => {
        const mv = 3600;
        payload.bytes[OFFSET_BATTERY_MV] = (mv & 0xFF00) >> 8;
        payload.bytes[OFFSET_BATTERY_MV+1] = (mv & 0xFF);
        expected.data.battery_mV = mv;
        expect(decodeUplink(payload)).toEqual(expected);
    });

});

