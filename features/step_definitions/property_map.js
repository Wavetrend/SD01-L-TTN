function unsignedEncode(bytes, value, offset, width) {
    for (let i = 0; i < width; i++) {
        bytes[offset+i] = (value >>> ((width-(i+1))*8)) & 0xFF
    }
    return bytes
}

const timestampHandler = {
    encode: (bytes, value) => unsignedEncode(bytes, value, 0, 4),
    decode: (object, value) => decodeHandler(object, value, 'timestamp'),
}

function flowSettlingCountHandler(sensor) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value << 4 >>> 0, 6 + sensor, 1),
        decode: (object, value) => {
            object.config_type[sensor].flow_settling_count = value
            return object
        }
    }
}

function sensorStatusHandler(sensor) {
    return {
        encode: (bytes, value) => {
            bytes[0] = (bytes[0] & ~(0x01 << sensor)) | (!!value << sensor)
            return bytes
        },
        decode: (object, value) => {
            object.sensor[sensor] = !!value
            return object
        },
    }
}
function configTypeHandler(sensor) {
    return {
        encode: (bytes, value) => unsignedEncode(bytes, value & 0x0F >>> 0, 6 + sensor, 1),
        decode: (object, value) => {
            object.config_type[sensor].config = value
            return object
        }
    }
}

function decodeHandler(object, value, property) {
    object[property] = value
    return object
}

const uplinkPropertyMap = [
    {},     // LoRaWAN reserved port
    {},     // v1 payloads

    // install request
    {
        // sequence: sequenceHandler,
        // timestamp: timestampHandler,
        // nonce: nonceHandler,
        pvd_level: {
            encode: (bytes, value) => {
                bytes[0] = (bytes[0] & ~(0x07 << 3)) | (value & 0x07) << 3
                return bytes
            },
            decode: (object, value) => decodeHandler(object, value, 'pvd_level'),
        },
        'status': [
            sensorStatusHandler(0),
            sensorStatusHandler(1),
            sensorStatusHandler(2),
        ],
        'firmware_version.major': {
            encode: (bytes, value) => unsignedEncode(bytes, value, 1, 1),
            decode: (object, value) => {
                object.firmware_version.major = value
                return object
            }
        },
        'firmware_version.minor': {
            encode: (bytes, value) => unsignedEncode(bytes, value, 2, 1),
            decode: (object, value) => {
                object.firmware_version.minor = value
                return object
            }
        },
        reset_reason: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 3, 2),
            decode: (object, value) => decodeHandler(object, value, 'reset_reason'),
        },
    },
    // standard report
    {
        timestamp: timestampHandler,
        sensor_id: {
            encode: (bytes, value) => {
                bytes[4] = (bytes[4] & ~0x03) | (value & 0x03)
                return bytes
            },
            decode: (object, value) => {
                object.sensor_id = value
                return object
            },
        },
        MinC: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 5, 1),
            decode: (object, value) => decodeHandler(object, value, 'minC'),
        },
        MaxC: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 6, 1),
            decode: (object, value) => decodeHandler(object, value, 'maxC'),
        },
        Events: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 7, 1),
            decode: (object, value) => decodeHandler(object, value, 'events'),
        },
        Reports: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 8, 1),
            decode: (object, value) => decodeHandler(object, value, 'reports'),
        },
    },
    // install response
    {
        error_code: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 0, 1),
            decode: (object, value) => decodeHandler(object, value, 'error_code'),
        },
    },
    // sensor error
    {
        sensor_id: {
            encode: (bytes, value) => {
                bytes[0] = (bytes[0] & ~0x03) | (value & 0x03)
                return bytes
            },
            decode: (object, value) => {
                object.sensor_id = value & 0x03
                return object
            }
        }
    },
    // general error
    {
        error_code: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 0, 2),
            decode: (object, value) => decodeHandler(object, value, 'error_code'),
        },
        file_hash: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 2, 2),
            decode: (object, value) => decodeHandler(object, value, 'file_hash'),
        },
        line: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 4, 2),
            decode: (object, value) => decodeHandler(object, value, 'line'),
        },
    },
    // freeze report
    {
        sensor_id: {
            encode: (bytes, value) => {
                bytes[0] = (bytes[0] & ~0x03) | ((value - 1) & 0x03)
                return bytes
            },
            decode: (object, value) => {
                object.sensor_id = (value - 1) & 0x03
                return object
            }
        },
        temperature: {
            encode: (bytes, value) => { bytes[1] = value; return bytes },
            decode: (object, value) => decodeHandler(object, value, 'temperature'),
        },
    },
    // scald report
    {
        sensor_id: {
            encode: (bytes, value) => {
                bytes[0] = (bytes[0] & ~0x03) | ((value - 1) & 0x03)
                return bytes
            },
            decode: (object, value) => {
                object.sensor_id = (value - 1) & 0x03
                return object
            }
        },
        temperature: {
            encode: (bytes, value) => { bytes[1] = value; return bytes },
            decode: (object, value) => decodeHandler(object, value, 'temperature'),
        },
    },
]

const downlinkPropertyMap = [
    {},     // LoRaWAN reserved port
    {},     // v1 payloads

    // configuration
    {
        downlink_hours: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 0, 1),
            decode: (object, value) => decodeHandler(object, value, 'downlink_hours'),
        },
        reporting_period: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 1, 2),
            decode: (object, value) => decodeHandler(object, value, 'reporting_period'),
        },
        scald: {
            encode: (bytes, value) => {
                bytes[3] = (bytes[3] & ~0x01) | (!!value)
                return bytes
            },
            decode: (object, value) => {
                object.message_flags.scald = !!(value & 0x01)
                return object
            }
        },
        freeze: {
            encode: (bytes, value) => {
                bytes[3] = (bytes[3] & ~0x02) | (!!value << 1)
                return bytes
            },
            decode: (object, value) => {
                object.message_flags.freeze = !!value
                return object
            }
        },
        debug: {
            encode: (bytes, value) => {
                bytes[3] = (bytes[3] & ~0x04) | (!!value << 2)
                return bytes
            },
            decode: (object, value) => {
                object.message_flags.debug = !!value
                return object
            }
        },
        history_count: {
            encode: (bytes, value) => {
                bytes[3] = (bytes[3] & ~0x18) | ((value & 0x03) << 3)
                return bytes
            },
            decode: (object, value) => {
                object.message_flags.history_count = value & 0x03
                return object
            }
        },
        scald_threshold: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 4, 1),
            decode: (object, value) => decodeHandler(object, value, 'scald_threshold')
        },
        freeze_threshold: {
            encode: (bytes, value) => unsignedEncode(bytes, value, 5, 1),
            decode: (object, value) => decodeHandler(object, value, 'freeze_threshold')
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
    uplinkPropertyMap,
    downlinkPropertyMap,
}