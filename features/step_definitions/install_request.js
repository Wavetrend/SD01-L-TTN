const {Given} = require("@cucumber/cucumber")
const {SD01L_PAYLOAD_TYPE} = require("../../src/uplink")

Given("An installation request payload, version {int}", function (version) {
    this.encoded = [
        SD01L_PAYLOAD_TYPE.INSTALL_REQUEST,
        version,
        0,
        0x00, 0x00, 0x00, 0x00, // 03 - timestamp
        0x00, 0x00, 0x00, 0x00, // 07 - nonce
        0x00, 0x00,             // 11 - battery mV
        0x01, 0x0E,             // 13 - sensor 1 temp (0degC)
        0x01, 0x0E,             // 15 - sensor 2 temp (0degC)
        0x01, 0x0E,             // 17 - sensor 3 temp (0degC)
        0x00, 0x00, 0x00, 0x00, // 19 - version
        0x00, 0x00,             // 23 - reset reason
    ];

    this.decoded = {
        type: SD01L_PAYLOAD_TYPE.INSTALL_REQUEST,
        version: version,
        sequence: 0,
        timestamp: 0,
        nonce: 0,
        battery_mV: 0,
        temperature: [
            0, 0, 0
        ],
        firmware_version: {
            major: 0,
            minor: 0,
            build: 0,
        },
        reset_reason: 0
    }
})
