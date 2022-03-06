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

function tempCHandler(offset, property) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value, offset, 1),
        decode: (object, value) => {
            object[property] = value
            return object
        }
    }
}

function currentPropertyHandler(sensor, offset, property) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value, offset + (sensor * 4), 1),
        decode: (object, value) => {
            object.current.sensor[sensor][property] = value
            return object
        }
    }
}

function historyPropertyHandler(history, sensor, offset, property) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value, offset + (sensor * 4), 1),
        decode: (object, value) => {
            object.history[history].sensor[sensor][property] = value
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
    // install response
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        error_code: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 7, 1),
            decode: (object, value) => {
                object.error_code = value
                return object
            },
        },
    },
    // standard report
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        CurrentMinC: [
            currentPropertyHandler(0, 7, 'minC'),
            currentPropertyHandler(1, 7, 'minC'),
            currentPropertyHandler(2, 7, 'minC'),
        ],
        CurrentMaxC: [
            currentPropertyHandler(0, 8, 'maxC'),
            currentPropertyHandler(1, 8, 'maxC'),
            currentPropertyHandler(2, 8, 'maxC'),
        ],
        CurrentEvents: [
            currentPropertyHandler(0, 9, 'events'),
            currentPropertyHandler(1, 9, 'events'),
            currentPropertyHandler(2, 9, 'events'),
        ],
        CurrentReports: [
            currentPropertyHandler(0, 10, 'reports'),
            currentPropertyHandler(1, 10, 'reports'),
            currentPropertyHandler(2, 10, 'reports'),
        ],
        History1MinC: [
            historyPropertyHandler(0, 0, 23, 'minC'),
            historyPropertyHandler(0, 1, 23, 'minC'),
            historyPropertyHandler(0, 2, 23, 'minC'),
        ],
        History1MaxC: [
            historyPropertyHandler(0, 0, 24, 'maxC'),
            historyPropertyHandler(0, 1, 24, 'maxC'),
            historyPropertyHandler(0, 2, 24, 'maxC'),
        ],
        History1Events: [
            historyPropertyHandler(0, 0, 25, 'events'),
            historyPropertyHandler(0, 1, 25, 'events'),
            historyPropertyHandler(0, 2, 25, 'events'),
        ],
        History1Reports: [
            historyPropertyHandler(0, 0, 26, 'reports'),
            historyPropertyHandler(0, 1, 26, 'reports'),
            historyPropertyHandler(0, 2, 26, 'reports'),
        ],
        History2MinC: [
            historyPropertyHandler(1, 0, 39, 'minC'),
            historyPropertyHandler(1, 1, 39, 'minC'),
            historyPropertyHandler(1, 2, 39, 'minC'),
        ],
        History2MaxC: [
            historyPropertyHandler(1, 0, 40, 'maxC'),
            historyPropertyHandler(1, 1, 40, 'maxC'),
            historyPropertyHandler(1, 2, 40, 'maxC'),
        ],
        History2Events: [
            historyPropertyHandler(1, 0, 41, 'events'),
            historyPropertyHandler(1, 1, 41, 'events'),
            historyPropertyHandler(1, 2, 41, 'events'),
        ],
        History2Reports: [
            historyPropertyHandler(1, 0, 42, 'reports'),
            historyPropertyHandler(1, 1, 42, 'reports'),
            historyPropertyHandler(1, 2, 42, 'reports'),
        ],
        History1Timestamp: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 19, 4),
            decode: (object, value) => {
                object.history[0].timestamp = value
                return object
            }
        },
        History2Timestamp: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 35, 4),
            decode: (object, value) => {
                object.history[1].timestamp = value
                return object
            }
        },
    },
    // ambient report
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        minC: tempCHandler(7, 'minC'),
        maxC: tempCHandler(8, 'maxC'),
        avgC: tempCHandler(9, 'avgC'),
    },
    // scald report
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        sensor: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 7, 1),
            decode: (object, value) => {
                object.sensor = value
                return object
            },
        },
        temperature: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 8, 1),
            decode: (object, value) => {
                object.temperature = value
                return object
            },
        },
    },
    // freeze report
    {
        sequence: sequenceHandler,
        timestamp: timestampHandler,
        sensor: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 7, 1),
            decode: (object, value) => {
                object.sensor = value
                return object
            },
        },
        temperature: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 8, 1),
            decode: (object, value) => {
                object.temperature = value
                return object
            },
        },
    },
]

module.exports = {
    propertyMap,
}