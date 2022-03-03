const {Given} = require("@cucumber/cucumber");
const {SD01L_PAYLOAD_TYPE} = require("../../src/uplink");

Given("a configuration payload, version {int}", function (version) {
    this.encoded = [
        SD01L_PAYLOAD_TYPE.CONFIGURATION,
        version,
        0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,     // 07 - nonce
        0x00,                       // 11 - downlink_hours
        0x00,                       // 12 - message flags
        0x00,                       // 13 - scald threshold
        0x00,                       // 14 - freeze threshold
        0x00, 0x00,                 // 15 - reporting period
        0x00,                       // 17 - sensor 1 config
        0x00,                       // 18 - sensor 2 config
        0x00,                       // 19 - sensor 3 config
    ];

    this.decoded = {
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
    }
})
