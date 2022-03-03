const { Given, When, Then, Before, defineParameterType } = require('@cucumber/cucumber');
const { decodeUplink, SD01L_PAYLOAD_TYPE} = require("../../src/uplink");
const { encodeDownlink, decodeDownlink } = require("../../src/downlink");

defineParameterType({
    name: 'valueType',
    regexp: /0x[0-9A-Fa-f]+|-?\d+(?:\.\d+)?|null|true|false/,
    transformer(value) {
        switch (value) {
            case 'true':
                return true
            case 'false':
                return false
            case 'null':
                return null
            default:
                if (value.includes('.')) {
                    return parseFloat(value)
                }
                return parseInt(value)
        }
    }
});

Before(function () {
    this.encoded = []
    this.decoded = {}
    delete this.actual
})

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
});

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

function unsignedEncode(bytes, value, offset, width) {
    for (let i = 0; i < width; i++) {
        bytes[offset+i] = (value >>> ((width-(i+1))*8)) & 0xFF
    }
    return bytes
}

const sequenceHandler = {
    encode: (bytes, value) => unsignedEncode(bytes, value, 2, 1),
    decode: (object, value) => {
        object.sequence = value
        return object
    },
}

const timestampHandler = {
    encode: (bytes, value) => unsignedEncode(bytes, value, 3, 4),
    decode: (object, value) => {
        object.timestamp = value
        return object
    },
}

const nonceHandler = {
    encode: (bytes, value) => unsignedEncode(bytes, value, 7, 4),
    decode: (object, value) => {
        object.nonce = value
        return object
    },
}

function temperatureHandler(sensor) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value === null ? 65535 : (value + 27) * 10, 13 + (sensor * 2), 2),
            decode: (object, value) => {
            object.temperature[sensor] = value
            return object
        }
    }
}

function flowSettlingCountHandler(sensor) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value << 4 >>> 0, 17 + sensor, 1),
        decode: (object, value) => {
            object.config_type[sensor].flow_settling_count = value
            return object
        }
    }
}

function configTypeHandler(sensor) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value & 0x0F >>> 0, 17 + sensor, 1),
        decode: (object, value) => {
            object.config_type[sensor].config = value
            return object
        }
    }
}

const propertyMap = [
    // install request
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        nonce: nonceHandler,
        battery_mV: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 11, 2),
            decode: (object, value) => {
                object.battery_mV = value
                return object
            }
        },
        temperature: [
            temperatureHandler(0),
            temperatureHandler(1),
            temperatureHandler(2),
        ],
        'firmware_version.major': {
            encode: (bytes, value) => unsignedEncode(bytes, value, 19, 1),
            decode: (object, value) => {
                object.firmware_version.major = value
                return object
            }
        },
        'firmware_version.minor': {
            encode: (bytes, value) => unsignedEncode(bytes, value, 20, 1),
            decode: (object, value) => {
                object.firmware_version.minor = value
                return object
            }
        },
        'firmware_version.build': {
            encode: (bytes, value) => unsignedEncode(bytes, value, 21, 2),
            decode: (object, value) => {
                object.firmware_version.build = value
                return object
            }
        },
        reset_reason: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 23, 2),
            decode: (object, value) => {
                object.reset_reason = value
                return object
            }
        },
    },
    // configuration
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        nonce: nonceHandler,
        downlink_hours: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 11, 1),
            decode: (object, value) => {
                object.downlink_hours = value
                return object
            }
        },
        scald: {
            encode: (bytes, value) => unsignedEncode(bytes, !!value, 12, 1),
            decode: (object, value) => {
                object.message_flags.scald = value
                return object
            }
        },
        freeze: {
            encode: (bytes, value) => unsignedEncode(bytes, !!value << 1 >>> 0, 12, 1),
            decode: (object, value) => {
                object.message_flags.freeze = value
                return object
            }
        },
        ambient: {
            encode: (bytes, value) => unsignedEncode(bytes, !!value << 2 >>> 0, 12, 1),
            decode: (object, value) => {
                object.message_flags.ambient = value
                return object
            }
        },
        debug: {
            encode: (bytes, value) => unsignedEncode(bytes, !!value << 3 >>> 0, 12, 1),
            decode: (object, value) => {
                object.message_flags.debug = value
                return object
            }
        },
        history_count: {
            encode: (bytes, value) => unsignedEncode(bytes, value << 6 >>> 0, 12, 1),
            decode: (object, value) => {
                object.message_flags.history_count = value
                return object
            }
        },
        scald_threshold: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 13, 1),
            decode: (object, value) => {
                object.scald_threshold = value
                return object
            }
        },
        freeze_threshold: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 14, 1),
            decode: (object, value) => {
                object.freeze_threshold = value
                return object
            }
        },
        reporting_period: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 15, 2),
            decode: (object, value) => {
                object.reporting_period = value
                return object
            }
        },
        flow_settling_count: [
            flowSettlingCountHandler(0),
            flowSettlingCountHandler(1),
            flowSettlingCountHandler(2),
        ],
        config_type: [
            configTypeHandler(0),
            configTypeHandler(1),
            configTypeHandler(2),
        ],
    },
]

Given("a {word} of {valueType}", function (property, value) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property].must.have.property('encode')
    propertyMap[this.decoded.type][property].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property].encode(this.encoded, value)
    this.decoded = propertyMap[this.decoded.type][property].decode(this.decoded, value)
})

Given("a sensor {int} {word} of {valueType}", function (sensor, property, value) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property][sensor-1].must.have.property('encode')
    propertyMap[this.decoded.type][property][sensor-1].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property][sensor-1].encode(this.encoded, value)
    this.decoded = propertyMap[this.decoded.type][property][sensor-1].decode(this.decoded, value)
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
    this.actual.must.eql({
        data: this.decoded,
        warnings: [],
        errors: [],
    })
})

Then("it should be encoded", function () {
    this.actual.must.eql({
        bytes: this.encoded,
        fPort: this.fPort || 1,
        warnings: [],
        errors: [],
    })
})