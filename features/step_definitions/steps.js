const { Given, When, Then } = require('@cucumber/cucumber');
const { decodeUplink, SD01L_PAYLOAD_TYPE} = require("../../src/uplink");
const { strict: assert } = require('assert');

Given("An installation request, version {int}", function (version) {
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
    this.fPort = 1;

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
});

Given("has a sequence of {int}", function (sequence) {
    this.encoded[2] = sequence
    this.decoded.sequence = sequence
})

Given("has a timestamp of {int}", function (timestamp) {
    this.encoded[3] = timestamp >>> 24 & 0xFF
    this.encoded[4] = timestamp >>> 16 & 0xFF
    this.encoded[5] = timestamp >>> 8 & 0xFF
    this.encoded[6] = timestamp >>> 0 & 0xFF
    this.decoded.timestamp = timestamp
})

Given("has a nonce of {int}", function (nonce) {
    this.encoded[7] = nonce >>> 24 & 0xFF
    this.encoded[8] = nonce >>> 16 & 0xFF
    this.encoded[9] = nonce >>> 8 & 0xFF
    this.encoded[10] = nonce >>> 0 & 0xFF
    this.decoded.nonce = nonce
})

When("the uplink decoder is called", function () {
    this.actual = decodeUplink({ bytes: this.encoded, fPort: this.fPort })
})

Then("it should be decoded", function () {
    this.actual.must.eql({ data: this.decoded, errors: [], warnings: [] })
})