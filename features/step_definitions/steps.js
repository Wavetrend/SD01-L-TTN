const { Given, When, Then } = require('@cucumber/cucumber');
const { decodeUplink, SD01L_PAYLOAD_TYPE} = require("../../src/uplink");
const { encodeDownlink, decodeDownlink } = require("../../src/downlink");

const { defineParameterType } = require('@cucumber/cucumber');

defineParameterType({
    name: 'hexint',
    regexp: /(0x[0-9A-Fa-f]+|[0-9]+)/,
    transformer(value) {
        return parseInt(value);
    }
});

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

Given("a configuration, version {int}", function (version) {
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

Given("a sequence of {int}", function (sequence) {
    this.encoded[2] = sequence
    this.decoded.sequence = sequence
})

Given("a timestamp of {hexint}", function (timestamp) {
    this.encoded[3] = timestamp >>> 24 & 0xFF
    this.encoded[4] = timestamp >>> 16 & 0xFF
    this.encoded[5] = timestamp >>> 8 & 0xFF
    this.encoded[6] = timestamp >>> 0 & 0xFF
    this.decoded.timestamp = timestamp
})

Given("a nonce of {hexint}", function (nonce) {
    this.encoded[7] = nonce >>> 24 & 0xFF
    this.encoded[8] = nonce >>> 16 & 0xFF
    this.encoded[9] = nonce >>> 8 & 0xFF
    this.encoded[10] = nonce >>> 0 & 0xFF
    this.decoded.nonce = nonce
})

When("the uplink decoder is called", function () {
    this.actual = decodeUplink({ bytes: this.encoded, fPort: this.fPort || 1 })
})

When("the downlink encoder is called", function () {
    this.actual = encodeDownlink({ data: this.decoded });
})

When("the downlink decoder is called", function () {
    this.actual = decodeDownlink({ bytes: this.encoded, fPort: 1 });
})

Then("it should be decoded", function () {
    this.actual.must.eql({ data: this.decoded, errors: [], warnings: [] })
})

Then("it should be encoded", function () {
    this.actual.must.eql({ bytes: this.encoded, warnings: [], errors: [], fPort: this.fPort || 1 });
})