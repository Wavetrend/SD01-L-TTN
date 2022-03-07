/**
 @file SD01-L Water Temperature Monitor Downlink Payload Formatter for TTN
 @module src/uplink.js
 @author Dave Meehan
 @copyright Wavetrend Europe Ltd
 @see {@link https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/}
 @see {@link https://www.youtube.com/watch?v=nT2FnwCoP7w}
 */

/**
 * @typedef {Object} Wavetrend.SD01L.Version
 * @property {number} major
 * @property {number} minor
 * @property {number} build
 */
/**
 * Issued by device when installed to acquire operating configuration
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.InstallRequest
 * @property {number} nonce - random nonce value to exchange with server
 * @property {number} battery_mV - current battery level in millivolts
 * @property {number[]} temperature - current temperature for each sensor (degrees C)
 * @property {Wavetrend.SD01L.Version} firmware_version - current firmware version
 * @property {number} reset_reason - Reason for last device reset (manufacturer internal)
 */

/**
 * @typedef {number} Wavetrend.SD01L.InstallationErrorCode
 * @readonly
 * @enum {number}
 * @property {Wavetrend.SD01L.InstallationErrorCode} NONE - 0
 * @property {Wavetrend.SD01L.InstallationErrorCode} SENSOR_DISABLED - 1 - Installed sensor cannot be disabled
 * @property {Wavetrend.SD01L.InstallationErrorCode} SENSOR_MISSING - 2 - Non-installed sensor cannot be configured
 * @property {Wavetrend.SD01L.InstallationErrorCode} DOWNLINK - 3 - Downlink interval out of range
 * @property {Wavetrend.SD01L.InstallationErrorCode} MESSAGE_FLAGS - 4 - Illegal message flags specified
 * @property {Wavetrend.SD01L.InstallationErrorCode} SCALD_THRESHOLD - 5 - Scald threshold out of range
 * @property {Wavetrend.SD01L.InstallationErrorCode} FREEZE_THRESHOLD - 6 - Freeze threshold out of range
 * @property {Wavetrend.SD01L.InstallationErrorCode} REPORT_PERIOD - 7 - Report period out of range
 * @property {Wavetrend.SD01L.InstallationErrorCode} CONFIG_TYPE - 8 - Sensor configuration type invalid
 * @property {Wavetrend.SD01L.InstallationErrorCode} MISC - 9 - Miscellaneous error
 * @property {Wavetrend.SD01L.InstallationErrorCode} DOWNLINK_LATE - 10 - Downlink arrived too late
 * @property {Wavetrend.SD01L.InstallationErrorCode} DOWNLINK_NONCE - 11 - Downlink nonce mismatch
 * @property {Wavetrend.SD01L.InstallationErrorCode} DOWNLINK_DUPLICATE - 12 - Downlink duplicate received
 * @property {Wavetrend.SD01L.InstallationErrorCode} HISTORY_COUNT - 13 - History Count out of range
 *
 */
const SD01L_INSTALLATION_ERROR_CODE = {
    NONE: 0,
    SENSOR_DISABLED: 1,
    SENSOR_MISSING: 2,
    DOWNLINK: 3,
    MESSAGE_FLAGS: 4,
    SCALD_THRESHOLD: 5,
    FREEZE_THRESHOLD: 6,
    REPORT_PERIOD: 7,
    CONFIG_TYPE: 8,
    MISC: 9,
    DOWNLINK_LATE: 10,
    DOWNLINK_NONCE: 11,
    DOWNLINK_DUPLICATE: 12,
    HISTORY_COUNT: 13,
};

/**
 * Issued by device after successfully receiving operating configuration
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.InstallResponse
 * @property {Wavetrend.SD01L.InstallationErrorCode} error
 */

/**
 * Standard sensor temperature readings
 * @typedef {Object} Wavetrend.SD01L.SensorReadings
 * @property {number} minC - degrees C
 * @property {number} maxC - degrees C
 * @property {number} events - count of total events
 * @property {number} reports - count of compliant events
 */

/**
 * Sensor reading histories (if enabled)
 * @typedef {{ timestamp: number, sensor: Wavetrend.SD01L.SensorReadings[] }} Wavetrend.SD01L.SensorHistory
 */

/**
 * Issued by the device at the standard report interval
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.StandardReport
 * @property {{ sensor: Wavetrend.SD01L.SensorReadings[] }} current
 * @property {Wavetrend.SD01L.SensorHistory[]} history
 */

/**
 * Issued by the device if ambient reporting is enabled
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.AmbientReport
 * @property {number} minC - degrees C
 * @property {number} maxC - degrees C
 * @property {number} avgC - degrees C
 */

/**
 * Issued by the device if freeze reporting is enabled
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.FreezeReport
 * @property {number} sensor - sensor number, zero based
 * @property {number} temperature - degrees C
 */

/**
 * Issued by the device if scald reporting is enabled
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.ScaldReport
 * @property {number} sensor - sensor number, zero based
 * @property {number} temperature - degrees C
 */

/**
 * Issued by the device if a sensor error is detected
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.SensorErrorReport
 * @property {number[]} sensor - value for each sensor, 1=error, 0=no error
 */

/**
 * Issued by the device if a general device error is detected
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.GeneralErrorReport
 * @property {number} error_code - Error code (manufacturer internal)
 * @property {string} file - source file (manufacturer internal)
 * @property {number} line - source line (manufacturer internal)
 */

/**
 * @namespace TTN.Uplink
 */

/**
 * Format of data provided to the V3 decoder by TTN
 * @typedef {Object} TTN.Uplink.DecoderInput
 * @property {number[]} bytes - array of received bytes
 * @property {number} fPort - LoRaWAN port number
 */

/**
 * Composite of all SD01L uplink messages
 * @typedef {Wavetrend.SD01L.InstallRequest|Wavetrend.SD01L.InstallResponse|Wavetrend.SD01L.StandardReport|Wavetrend.SD01L.AmbientReport|Wavetrend.SD01L.FreezeReport|Wavetrend.SD01L.ScaldReport|Wavetrend.SD01L.SensorErrorReport|Wavetrend.SD01L.GeneralErrorReport} Wavetrend.SD01L.UplinkPayloads
 */

/**
 * Format of the result data expected by the V3 TTN decoder
 * @typedef {Object} TTN.Uplink.DecoderSuccess
 * @property {Wavetrend.SD01L.UplinkPayloads} data - Decoded payload
 * @property {string[]} [warnings] - any warnings generated by the decoding
 */

/**
 * Format of the result data expected by the V3 TTN decoder
 * @typedef {Object} TTN.Uplink.DecoderError
 * @property {string[]} errors - any errors generated by the decoding
 */

/**
 * Format of the result data expected by the V3 TTN decoder
 * @typedef {TTN.Uplink.DecoderSuccess|TTN.Uplink.DecoderError} TTN.Uplink.DecoderOutput
 */

/**
 * Wavetrend SD01L Payload Type (documented in encoder.js)
 * @ignore
 */
const SD01L_PAYLOAD_TYPE = {
    INSTALL_REQUEST: 0,
    CONFIGURATION: 1,
    INSTALL_RESPONSE: 2,
    STANDARD_REPORT: 3,
    AMBIENT_REPORT: 4,
    SCALD_REPORT: 5,
    FREEZE_REPORT: 6,
    LOW_BATTERY_REPORT_DEPRECATED: 7,
    SENSOR_ERROR_REPORT: 8,
    GENERAL_ERROR_REPORT: 9,
    SENSOR_DATA_DEBUG: 10,
};

const OFFSET_TYPE = 0;
const OFFSET_VERSION = 1;
const OFFSET_SEQUENCE = 2;
const OFFSET_TIMESTAMP = 3;

/**
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.PartialPayloadDecode
 * @property {number[]} bytes
 */

/**
 * Decode the common header fields
 * @param {number[]} bytes
 * @returns {Wavetrend.SD01L.PartialPayloadDecode}
 * @memberOf Wavetrend.SD01L
 */
function Decode_SD01L_PayloadHeader(bytes) {
    let i;
    let payload = {bytes: []};

    for (i = 0; i < bytes.length; i++) {
        switch (i) {
            case OFFSET_TYPE:
                payload.type = unsignedByte(bytes[i]);
                break;
            case OFFSET_VERSION:
                payload.version = unsignedByte(bytes[i]);
                break;
            case OFFSET_SEQUENCE:
                payload.sequence = unsignedByte(bytes[i]);
                break;
            case OFFSET_TIMESTAMP:
                payload.timestamp =
                    (unsignedByte(bytes[i++]) << 24 >>> 0)
                    + (unsignedByte(bytes[i++]) << 16 >>> 0)
                    + (unsignedByte(bytes[i++]) << 8 >>> 0)
                    + unsignedByte(bytes[i]);
                break;
            default:
                payload.bytes = bytes.slice(i);
                i = bytes.length;
        }
    }
    return payload;
}

/**
 * @memberOf Wavetrend.SD01L
 * @param {number} input - unsigned value
 * @returns {number} - signed representation of LSB of input
 */
function signedByte(input) {
    return (input & 0xFF) << 24 >> 24;
}

/**
 * @memberOf Wavetrend.SD01L
 * @param {number} input - unsigned value
 * @returns {number} - unsigned representation of LSB of input
 */
function unsignedByte(input) {
    return (input & 0xFF) >>> 0;
}

/**
 * Decode SD01L specific message payloads
 * @param {number[]} bytes
 * @returns {Wavetrend.SD01L.UplinkPayloads}
 * @memberOf Wavetrend.SD01L
 */
function Decode_SD01L_Payload(bytes) {
    let payload = Decode_SD01L_PayloadHeader(bytes);
    bytes = payload.bytes;
    delete payload.bytes;
    let i = 0;

    switch (payload.type) {
        case SD01L_PAYLOAD_TYPE.INSTALL_REQUEST:
            /* istanbul ignore else */
            if (payload.version === 4) {
                payload.nonce =
                    (unsignedByte(bytes[i++]) << 24 >>> 0)
                    + (unsignedByte(bytes[i++]) << 16 >>> 0)
                    + (unsignedByte(bytes[i++]) << 8 >>> 0)
                    + unsignedByte(bytes[i++]);
                payload.battery_mV = (unsignedByte(bytes[i++]) << 8 >>> 0) + unsignedByte(bytes[i++]);
                payload.temperature = [];
                for (let sensor = 0; sensor < 3; sensor++) {
                    let temp_index = (unsignedByte(bytes[i++]) << 8 >>> 0) + unsignedByte(bytes[i++]);
                    payload.temperature[sensor] = temp_index === 0xFFFF ? null : (temp_index - 270) / 10;
                }
                payload.firmware_version = {
                    major: unsignedByte(bytes[i++]),
                    minor: unsignedByte(bytes[i++]),
                    build: (bytes[i++] << 8 >>> 0) + unsignedByte(bytes[i++]),
                };
                payload.reset_reason = (bytes[i++] << 8 >>> 0) + unsignedByte(bytes[i++]);
            }
            break;

        case SD01L_PAYLOAD_TYPE.INSTALL_RESPONSE:
            /* istanbul ignore else */
            if (payload.version === 1) {
                payload.error_code = unsignedByte(bytes[i++]);
            }
            break;

        case SD01L_PAYLOAD_TYPE.STANDARD_REPORT:
            /* istanbul ignore else */
            if (payload.version === 1) {
                payload.current = {sensor: []};
                for (let sensor = 0; sensor < 3; sensor++) {
                    payload.current.sensor[sensor] = {
                        minC: signedByte(bytes[i++]),
                        maxC: signedByte(bytes[i++]),
                        events: unsignedByte(bytes[i++]),
                        reports: unsignedByte(bytes[i++]),
                    };
                }
                payload.history = [];
                for (let history = 0; history < 2 && i < bytes.length; history++) {
                    payload.history[history] = {
                        timestamp:
                            (unsignedByte(bytes[i++]) << 24 >>> 0)
                            + (unsignedByte(bytes[i++]) << 16 >>> 0)
                            + (unsignedByte(bytes[i++]) << 8 >>> 0)
                            + unsignedByte(bytes[i++]),
                        sensor: [],
                    };
                    for (let sensor = 0; sensor < 3; sensor++) {
                        payload.history[history].sensor[sensor] = {
                            minC: signedByte(bytes[i++]),
                            maxC: signedByte(bytes[i++]),
                            events: unsignedByte(bytes[i++]),
                            reports: unsignedByte(bytes[i++]),
                        };
                    }
                }
            }
            break;

        case SD01L_PAYLOAD_TYPE.AMBIENT_REPORT:
            /* istanbul ignore else */
            if (payload.version === 0) {
                payload.minC = signedByte(bytes[i++]);
                payload.maxC = signedByte(bytes[i++]);
                payload.avgC = signedByte(bytes[i++]);
            }
            break;

        case SD01L_PAYLOAD_TYPE.FREEZE_REPORT:
        case SD01L_PAYLOAD_TYPE.SCALD_REPORT:
            /* istanbul ignore else */
            if (payload.version === 0) {
                payload.sensor = unsignedByte(bytes[i++]);
                payload.temperature = signedByte(bytes[i++]);
            }
            break;

        case SD01L_PAYLOAD_TYPE.SENSOR_ERROR_REPORT:
            /* istanbul ignore else */
            if (payload.version === 0) {
                payload.sensor = [];
                for (let sensor = 0; sensor < 3; sensor++) {
                    payload.sensor[sensor] = unsignedByte(bytes[i++]);
                }
            }
            break;

        case SD01L_PAYLOAD_TYPE.GENERAL_ERROR_REPORT:
            /* istanbul ignore else */
            if (payload.version === 0) {
                payload.error_code = (unsignedByte(bytes[i++]) << 8 >>> 0) + unsignedByte(bytes[i++]);
                payload.file = "";
                for (let pos = 0, append = true; pos < 32; pos++) {
                    if (append && bytes[i] !== 0) {
                        payload.file += String.fromCharCode(unsignedByte(bytes[i++]));
                    } else {
                        append = false;
                        i++;
                    }
                }
                payload.line = (unsignedByte(bytes[i++]) << 8 >>> 0) + unsignedByte(bytes[i++]);
            }
            break;

        case SD01L_PAYLOAD_TYPE.CONFIGURATION:
        case SD01L_PAYLOAD_TYPE.LOW_BATTERY_REPORT_DEPRECATED:
        case SD01L_PAYLOAD_TYPE.SENSOR_DATA_DEBUG:
            throw "Unsupported type for uplink decoding";

        default:
            throw "Unrecognised type for uplink decoding";
    }
    return payload;
}

/**
 * Entry point for TTN V3 uplink decoder
 * @param {TTN.Uplink.DecoderInput} input
 * @returns {TTN.Uplink.DecoderOutput} - object containing the result of the decode, which might include warnings or errors
 */
function decodeUplink(input) {
    let payload = {
        warnings: [],
        errors: [],
    };

    try {
        payload.data = Decode_SD01L_Payload(input.bytes);
    } catch (error) {
        payload.errors.push(error);
    }

    return payload;
}

/**
 * Entry point for TTN V2 uplink decoder
 * @param {number[]} bytes - array of received bytes
 * @param {number} port - LoRaWAN fPort number
 * @returns {Wavetrend.SD01L.UplinkPayloads|null} - object containing decoded payload, or null if an error is encountered
 */
function Decoder(bytes, port) {
    try {
        return Decode_SD01L_Payload(bytes);
    } catch (e) {
        return null;
    }
}

// NB: Not used for TTN production, required for Unit Testing
/* istanbul ignore else */
if (typeof module !== 'undefined') {
    module.exports = {
        Decoder,
        decodeUplink,
        SD01L_PAYLOAD_TYPE,
    };
}