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

module.exports = {
    propertyMap,
}