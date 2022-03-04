const {Given} = require("@cucumber/cucumber");
const {SD01L_PAYLOAD_TYPE} = require("../../src/uplink");

Given("an ambient report, version {int}", function (version) {
    this.encoded = [
        SD01L_PAYLOAD_TYPE.AMBIENT_REPORT,
        version,
        0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,     // 07 - nonce
        0x00,                       // 07 - minC
        0x00,                       // 08 - maxC
        0x00,                       // 09 - avgC
    ];

    this.decoded = {
        type: SD01L_PAYLOAD_TYPE.AMBIENT_REPORT,
        version: version,
        sequence: 0,
        timestamp: 0,
        minC: 0,
        maxC: 0,
        avgC: 0,
    }
})
