const { v2, v3, SD01L_PAYLOAD_TYPE } = require('../src/decoder')

describe("Standard Report", () => {

    let payload, expected;

    beforeEach(() => {
        payload = {
            bytes: [
                                        // 00 - type
                SD01L_PAYLOAD_TYPE.STANDARD_REPORT,
                0x01,                   // 01 - version
                0x00,                   // 02 - sequence
                0x00, 0x00, 0x00, 0x00, // 03 - timestamp
                                        // current
                0x00,                   // 07 - sensor 1 - temp min
                0x00,                   // 08 - sensor 1 - temp max
                0x00,                   // 09 - sensor 1 - event count
                0x00,                   // 10 - sensor 1 - report count
                0x00,                   // 11 - sensor 2 - temp min
                0x00,                   // 12 - sensor 2 - temp max
                0x00,                   // 13 - sensor 2 - event count
                0x00,                   // 14 - sensor 2 - report count
                0x00,                   // 15 - sensor 3 - temp min
                0x00,                   // 16 - sensor 3 - temp max
                0x00,                   // 17 - sensor 3 - event count
                0x00,                   // 18 - sensor 3 - report count
                                        // history 1
                0x00, 0x00, 0x00, 0x00, // 19 - timestamp
                0x00,                   // 23 - sensor 1 - temp min
                0x00,                   // 24 - sensor 1 - temp max
                0x00,                   // 25 - sensor 1 - event count
                0x00,                   // 26 - sensor 1 - report count
                0x00,                   // 27 - sensor 2 - temp min
                0x00,                   // 28 - sensor 2 - temp max
                0x00,                   // 29 - sensor 2 - event count
                0x00,                   // 30 - sensor 2 - report count
                0x00,                   // 31 - sensor 3 - temp min
                0x00,                   // 32 - sensor 3 - temp max
                0x00,                   // 33 - sensor 3 - event count
                0x00,                   // 34 - sensor 3 - report count
                                        // history 2
                0x00, 0x00, 0x00, 0x00, // 35 - timestamp
                0x00,                   // 39 - sensor 1 - temp min
                0x00,                   // 40 - sensor 1 - temp max
                0x00,                   // 41 - sensor 1 - event count
                0x00,                   // 42 - sensor 1 - report count
                0x00,                   // 43 - sensor 2 - temp min
                0x00,                   // 44 - sensor 2 - temp max
                0x00,                   // 45 - sensor 2 - event count
                0x00,                   // 46 - sensor 2 - report count
                0x00,                   // 47 - sensor 3 - temp min
                0x00,                   // 48 - sensor 3 - temp max
                0x00,                   // 49 - sensor 3 - event count
                0x00,                   // 50 - sensor 3 - report count
            ],
            fPort: 1
        };

        expected = {
            data: {
                type: SD01L_PAYLOAD_TYPE.STANDARD_REPORT,
                version: 1,
                sequence: 0,
                timestamp: 0,
                current: {
                    sensor: [
                        {   // sensor 1
                            minC: 0,
                            maxC: 0,
                            events: 0,
                            reports: 0,
                        },
                        {   // sensor 2
                            minC: 0,
                            maxC: 0,
                            events: 0,
                            reports: 0,
                        },
                        {   // sensor 3
                            minC: 0,
                            maxC: 0,
                            events: 0,
                            reports: 0,
                        },
                    ],
                },
                history: [
                    {   // history 1
                        timestamp: 0,
                        sensor: [
                            {   // sensor 1
                                minC: 0,
                                maxC: 0,
                                events: 0,
                                reports: 0,
                            },
                            {   // sensor 2
                                minC: 0,
                                maxC: 0,
                                events: 0,
                                reports: 0,
                            },
                            {   // sensor 3
                                minC: 0,
                                maxC: 0,
                                events: 0,
                                reports: 0,
                            },
                        ],
                    },
                    {   // history 2
                        timestamp: 0,
                        sensor: [
                            {   // sensor 1
                                minC: 0,
                                maxC: 0,
                                events: 0,
                                reports: 0,
                            },
                            {   // sensor 2
                                minC: 0,
                                maxC: 0,
                                events: 0,
                                reports: 0,
                            },
                            {   // sensor 3
                                minC: 0,
                                maxC: 0,
                                events: 0,
                                reports: 0,
                            },
                        ],
                    }
                ]
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

            describe.each`
                group                  | base_offset    | is_history | history_index
                ${'Current'}           | ${7}           | ${false}   | ${-1}
                ${'History 1'}         | ${19}          | ${true}    | ${0}
                ${'History 2'}         | ${35}          | ${true}    | ${1}
            `(
                "$group",
                ({ base_offset, is_history, history_index }) => {
                    describe.each([1, 2, 3])(
                        "Sensor %p",
                        (sensor) => {

                            describe.each`
                                keyword      | offset   | values
                                ${'minC'}    | ${0}     | ${[ -27, 0 , 20, 100 ]}
                                ${'maxC'}    | ${1}     | ${[ -27, 0 , 20, 100 ]}
                                ${'events'}  | ${2}     | ${[ 0, 1, 255 ]}
                                ${'reports'} | ${3}     | ${[ 0, 1, 255 ]}
                            `(
                                "$keyword",
                                ({keyword, offset, values}) => {
                                    values.forEach(value => {
                                        let index = base_offset + (is_history ? 4 : 0) + ((sensor-1)*4) + offset;
                                        test(`count = ${value}`, () => {
                                            payload.bytes[index] = value & 0xFF >>> 0;
                                            if (is_history) {
                                                expected.data.history[history_index].sensor[sensor-1][keyword] = value;
                                            } else {
                                                expected.data.current.sensor[sensor-1][keyword] = value;
                                            }
                                            expect(decodeUplink(payload)).toEqual(expected)
                                        })
                                    })
                                }
                            )
                        }
                    )
                }
            )

            test.each`
                title              | data_length | histories
                ${'No Histories'}  | ${19}       | ${0}
                ${'1 History'}     | ${35}       | ${1}
            `(
                "$title",
                ({ data_length, histories }) => {
                    payload.bytes = payload.bytes.slice(0, data_length);
                    expected.data.history = expected.data.history.slice(0, histories)
                    expect(decodeUplink(payload)).toEqual(expected)
                }
            )
        }
    )

});