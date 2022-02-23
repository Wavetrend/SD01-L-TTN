/*
Wavetrend

SD01-L Water Temperature Monitor Payload Decoder for TTN

https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/
*/

/**
 * @namespace TTN.Decoder
 */

/**
 * @namespace Wavetrend
 */

/**
 * Base type for SD01L Message Payloads
 * @typedef {Object} Payload
 * @property {SD01L_PAYLOAD_TYPE}   type - payload type
 * @property {number}   version - payload version 0-255
 * @property {number}   sequence - payload sequence 0-255
 * @property {number}   timestamp - seconds since Unix epoch
 * @property {undefined|*} [string] - properties depending on payload type
 */

/**
 * Issued by device when installed to acquire operating configuration
 * @typedef {Payload} SD01L_InstallRequest
 * @property {number} nonce
 * @property {number} battery_mV
 * @property {number[]} temperature
 * @property {number} reset_reason
 */

/**
 * Issued by device after successfully receiving operating configuration
 * @typedef {Payload} SD01L_InstallResponse
 * @property {number} error
 */

/**
 * Standard sensor temperature readings
 * @typedef {Object} SensorReadings
 * @property {number} minC
 * @property {number} maxC
 * @property {number} events
 * @property {number} reports
 */

/**
 * Sensor reading histories (if enabled)
 * @typedef {{ timestamp: number, sensor: SensorReadings[] }} SensorHistory
 */

/**
 * Issued by the device at the standard report interval
 * @typedef {Payload} SD01L_StandardReport
 * @property {{ sensor: SensorReadings[] }} current
 * @property {SensorHistory[]} history
 */

/**
 * Issued by the device if ambient reporting is enabled
 * @typedef {Payload} SD01L_AmbientReport
 * @property {number} minC
 * @property {number} maxC
 * @property {number} avgC
 */

/**
 * Issued by the device if freeze reporting is enabled
 * @typedef {Payload} SD01L_FreezeReport
 * @property {number} sensor
 * @property {number} temperature
 */

/**
 * Issued by the device if scald reporting is enabled
 * @typedef {Payload} SD01L_ScaldReport
 * @property {number} sensor
 * @property {number} temperature
 */

/**
 * Issued by the device if a sensor error is detected
 * @typedef {Payload} SD01L_SensorErrorReport
 * @property {number[]} sensor
 */

/**
 * Issued by the device if a general device error is detected
 * @typedef {Payload} SD01L_GeneralErrorReport
 * @property {number} error_code
 * @property {string} file
 * @property {number} line
 */

/**
 * Format of data provided to the V3 decoder by TTN
 * @typedef {Object} DecoderInput
 * @property {number[]} bytes - array of received bytes
 * @property {number} fPort - LoRaWAN port number
 */

/**
 * Composite of all SD01L uplink messages
 * @typedef {SD01L_InstallRequest|SD01L_InstallResponse|SD01L_StandardReport|SD01L_AmbientReport|SD01L_FreezeReport|SD01L_ScaldReport|SD01L_SensorErrorReport|SD01L_GeneralErrorReport} SD01L_Payloads
 */

/**
 * Format of the result data expected by the V2 TTN decoder
 * @typedef {Object} DecoderOutput
 * @property {SD01L_Payloads} [data] - Decoded payload
 * @property {number} [fPort] - LoRaWAN port number
 * @property {string[]} warnings - any warnings generated by the decoding
 * @property {string[]} errors - any errors generated by the decoding
 */


/**
 * Wavetrend SD01L Payload Type
 * @readonly
 * @enum {number}
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

const OFFSET_TYPE = 0
const OFFSET_VERSION = 1
const OFFSET_SEQUENCE = 2
const OFFSET_TIMESTAMP = 3

/**
 * Decode the common header fields
 * @param {number[]} bytes
 * @returns {Payload}
 * @memberOf Wavetrend
 */
function Decode_SD01L_PayloadHeader(bytes) {
    let i;
    let payload = { bytes: [] };

    for(i=0 ; i < bytes.length ; i++) {
        switch (i) {
            case OFFSET_TYPE:
                payload.type = bytes[i];
                break;
            case OFFSET_VERSION:
                payload.version = bytes[i];
                break;
            case OFFSET_SEQUENCE:
                payload.sequence = bytes[i];
                break;
            case OFFSET_TIMESTAMP:
                payload.timestamp = (bytes[i++] << 24 >>> 0)+(bytes[i++] << 16 >>> 0)+(bytes[i++] << 8 >>> 0)+bytes[i];
                break;
            default:
                payload.bytes = bytes.slice(i)
                i = bytes.length
        }
    }
    return payload;
}

/**
 * Decode SD01L specific message payloads
 * @param {number[]} bytes
 * @returns {SD01L_Payloads}
 * @memberOf Wavetrend
 */
function Decode_SD01L_Payload(bytes) {
    let payload = Decode_SD01L_PayloadHeader(bytes);
    bytes = payload.bytes;
    delete payload.bytes;
    let i = 0

    switch (payload.type) {
        case SD01L_PAYLOAD_TYPE.INSTALL_REQUEST:
            if (payload.version === 4) {
                payload.nonce = (bytes[i++] << 24 >>> 0) + (bytes[i++] << 16 >>> 0) + (bytes[i++] << 8 >>> 0) + bytes[i++];
                payload.battery_mV = (bytes[i++] << 8 >>> 0) + bytes[i++];
                payload.temperature = [];
                for (let sensor = 0; sensor < 3; sensor++) {
                    let temp_index = (bytes[i++] << 8 >>> 0) + bytes[i++];
                    payload.temperature[sensor] = (temp_index - 270) / 10
                }
                payload.reset_reason = (bytes[i++] << 8 >>> 0) + bytes[i++];
            }
            break;

        case SD01L_PAYLOAD_TYPE.INSTALL_RESPONSE:
            if (payload.version === 3) {
                payload.error_code = bytes[i++]
            }
            break;

        case SD01L_PAYLOAD_TYPE.STANDARD_REPORT:
            if (payload.version === 1) {
                payload.current = { sensor: [] };
                for (let sensor = 0; sensor < 3; sensor++) {
                    payload.current.sensor[sensor] = {
                        minC: bytes[i++],
                        maxC: bytes[i++],
                        events: bytes[i++],
                        reports: bytes[i++],
                    };
                }
                payload.history = [];
                for (let history = 0; history < 2 && i < bytes.length; history++) {
                    payload.history[history] = {
                        timestamp: (bytes[i++] << 24 >>> 0) + (bytes[i++] << 16 >>> 0) + (bytes[i++] << 8 >>> 0) + bytes[i++],
                        sensor: [],
                    };
                    for (let sensor = 0; sensor < 3; sensor++) {
                        payload.history[history].sensor[sensor] = {
                            minC: bytes[i++],
                            maxC: bytes[i++],
                            events: bytes[i++],
                            reports: bytes[i++],
                        };
                    }
                }
            }
            break;

        case SD01L_PAYLOAD_TYPE.AMBIENT_REPORT:
            if (payload.version === 1) {
                payload.minC = bytes[i++];
                payload.maxC = bytes[i++];
                payload.avgC = bytes[i++];
            }
            break;

        case SD01L_PAYLOAD_TYPE.FREEZE_REPORT:
        case SD01L_PAYLOAD_TYPE.SCALD_REPORT:
            if (payload.version === 1) {
                payload.sensor = bytes[i++];
                payload.temperature = bytes[i++];
            }
            break;

        case SD01L_PAYLOAD_TYPE.SENSOR_ERROR_REPORT:
            if (payload.version === 1) {
                payload.sensor = [];
                for (let sensor = 0; sensor < 3; sensor++) {
                    payload.sensor[sensor] = bytes[i++]
                }
            }
            break;

        case SD01L_PAYLOAD_TYPE.GENERAL_ERROR_REPORT:
            if (payload.version === 1) {
                payload.error_code = bytes[i++];
                payload.file = "";
                for (let pos = 0, append = true; pos < 32; pos++) {
                    if (append && bytes[i] !== 0) {
                        payload.file += bytes[i++];
                    } else {
                        append = false;
                        i++;
                    }
                }
                payload.line = (bytes[i++] << 8 >>> 0) + bytes[i++];
            }
            break;

        case SD01L_PAYLOAD_TYPE.CONFIGURATION:
            throw "Configuration type is not a valid uplink message";

        case SD01L_PAYLOAD_TYPE.LOW_BATTERY_REPORT_DEPRECATED:
            throw "Low Battery Report is deprecated"

        case SD01L_PAYLOAD_TYPE.SENSOR_DATA_DEBUG:
            throw "Sensor Data Debug is not supported for decode"

        default:
            throw "Unrecognised Type Code"
    }
    return payload;
}

/**
 * Entry point for TTN V3 uplink decoder
 * @memberOf TTN.Decoder
 * @param {DecoderInput} input
 * @returns {DecoderOutput}
 */
function decodeUplink(input) {
    let payload = {
        warnings: [],
        errors: [],
    }

    try {
        payload.data = Decode_SD01L_Payload(input.bytes);
    } catch (error) {
        payload.errors.push(error);
    }

    return payload;
}

/**
 * Entry point for TTN V2 uplink decoder
 * @memberOf TTN.Decoder
 * @param {number[]} bytes - array of received bytes
 * @returns {SD01L_Payloads|null}
 */
function Decoder(bytes /*, port */) {
  try {
      return Decode_SD01L_Payload(bytes);
  } catch {
      return null
  }
}

// NB: Not used for TTN production, required for Unit Testing

module.exports = {
    v2: Decoder,
    v3: decodeUplink,
    SD01L_PAYLOAD_TYPE,
};