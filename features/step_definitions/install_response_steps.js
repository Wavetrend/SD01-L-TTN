const {Given} = require("@cucumber/cucumber");
const {SD01L_PAYLOAD_TYPE} = require("../../src/uplink");

Given("an installation response, version {int}", function (version) {
    this.encoded = [
        SD01L_PAYLOAD_TYPE.INSTALL_RESPONSE,
        version,
        0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00,                       // 07 - error_code
    ];

    this.decoded = {
        type: SD01L_PAYLOAD_TYPE.INSTALL_RESPONSE,
        version: version,
        sequence: 0,
        timestamp: 0,
        error_code: 0,
    }
})
