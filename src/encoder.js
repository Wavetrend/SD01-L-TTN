/*
Wavetrend

SD01-L Water Temperature Monitor Payload Encoder for TTN

https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/
https://www.youtube.com/watch?v=nT2FnwCoP7w
*/

/**
 * @namespace TTN.Encoder
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

/**
 * @typedef {Object} SD01L_Payload_Header
 * @property {SD01L_PAYLOAD_TYPE} type - payload type
 * @property {number} version - message payload version 0-255
 * @property {number} sequence - message payload sequence 0-255
 * @property {number} timestamp - seconds since Unix epoch
 */

/**
 * @typedef {Object} SD01L_Message_Flags
 * @property {boolean} scald - scald reporting enabled
 * @property {boolean} freeze - freeze reporting enabled
 * @property {boolean} ambient - ambient reporting enabled
 * @property {boolean} debug - debug reporting enabled
 * @property {boolean} lora_confirmed - LoRa confirmed message enabled (NB: must be false)
 * @property {number} history_count - number of history messages in standard report (0, 1, or 2)
 */

/**
 * SD01L Sensor Configuration Type
 * @readonly
 * @enum {number}
 */
const SD01L_SENSOR_TYPE = {
    Disabled: 0,
    HotOutletStandard: 1,
    HotOutletHealthcare: 2,
    ColdOutlet: 3,
    ColdUnitRising: 4,
    BlendedRisingScaldCheck: 5,
    HotUnitOutletFalling: 6,
    HotUnitReturnFalling: 7,
    HotUnitReturnHealthcareFalling: 8,
};

/**
 * @typedef {Object} SD01L_Sensor_Config
 * @property {number} flow_settling_count - number of readings to allow flow to settle
 * @property {SD01L_SENSOR_TYPE} config - identity of the sensor configuration
 */

/**
 * @typedef {SD01L_Payload_Header} SD01L_Configuration
 * @property {number} nonce - same value as contained in the install request
 * @property {number} downlink_hours - number of hours between configuration requests
 * @property {SD01L_Message_Flags} message_flags - option flags
 * @property {number} scald_threshold - temperature above which scald reports will be sent (if enabled)
 * @property {number} freeze_threshold - temperature below which freeze reports will be sent (if enabled)
 * @property {number} reporting_period - number of minutes between reports
 * @property {SD01L_Sensor_Config[]} config_type - configuration for each sensor
 */

/**
 * @typedef {SD01L_Configuration} SD01L_Downlink_Payloads
 */

/**
 * Encode the common header fields
 * @param {SD01L_Downlink_Payloads} object
 * @returns {number[]} - header fields encoded to byte array
 */
function Encode_SD01L_PayloadHeader(object) {
    let bytes = [];
    bytes.push(object.type);
    bytes.push(object.version);
    bytes.push(object.sequence);
    bytes.push((object.timestamp & 0xFF000000) >>> 24);
    bytes.push((object.timestamp & 0x00FF0000) >>> 16);
    bytes.push((object.timestamp & 0x0000FF00) >>> 8);
    bytes.push(object.timestamp & 0x000000FF);
    return bytes;
}

/**
 * Encode SD01L specific message payloads
 * @param {SD01L_Downlink_Payloads} object
 * @returns {number[]} - array of encoded bytes
 */
function Encode_SD01L_Payload(object) {
    let bytes = Encode_SD01L_PayloadHeader(object);

    switch (object.type) {
        case SD01L_PAYLOAD_TYPE.CONFIGURATION:
            bytes.push((object.nonce & 0xFF000000) >>> 24);
            bytes.push((object.nonce & 0x00FF0000) >>> 16);
            bytes.push((object.nonce & 0x0000FF00) >>> 8);
            bytes.push(object.nonce & 0x000000FF);
            bytes.push(object.downlink_hours & 0xFF);
            bytes.push(
                object.message_flags.scald << 1 >>> 0
                | object.message_flags.freeze << 2 >>> 0
                | object.message_flags.ambient << 3 >>> 0
                | object.message_flags.debug << 4 >>> 0
                | object.message_flags.lora_confirmed << 5 >>> 0
                | (object.message_flags.history_count & 0x03) << 6 >>> 0
            );
            bytes.push(object.scald_threshold);     // NB: signed
            bytes.push(object.freeze_threshold);    // NB: signed
            bytes.push((object.reporting_period & 0xFF00) >>> 8);
            bytes.push(object.reporting_period & 0x00FF);
            for (let sensor = 0; sensor < 3; sensor++) {
                bytes.push(
                    (object.config_type[sensor].flow_settling_count & 0x0F) << 4 >>> 0
                    | object.config_type[sensor].config & 0x0F
                );
            }
            break;

        default:
            if (object.type > 10) {
                throw "Unrecognised type for downlink encoding"
            }
            throw "Unsupported type for downlink encoding"
    }
    return bytes;
}

/**
 * @typedef {Object} EncoderInput
 * @property {SD01L_Downlink_Payloads} data
 */

/**
 * @typedef {Object} EncoderOutput
 * @property {number} [bytes] - byte array of encoded data
 * @property {number} [fPort] - LoRaWAN port number
 * @property {string[]} warnings - any warnings encountered during encoding
 * @property {string[]} errors - any errors encountered during encoding
 */

/**
 * Entry point for TTN V3 downlink encoder
 * @memberOf TTN.Encoder
 * @param {EncoderInput} input
 * @returns {EncoderOutput}
 */
function encodeDownlink(input) {
    let obj = {
        warnings: [],
        errors: [],
    };

    try {
        obj.bytes = Encode_SD01L_Payload(input.data);
        obj.fPort = 1;
    } catch (error) {
        obj.errors.push(error);
    }

    return obj;
}

/**
 * Entry point for TTN V2 downlink encoder
 * @memberOf TTN.Encoder
 * @param {SD01L_Downlink_Payloads} object
 * @returns {number[]} - byte array of encoded payload or empty array
 */
function Encoder(object /*, port */) {
    try {
        return Encode_SD01L_Payload(object);
    } catch {
        return [];
    }
}

// NB: Not used for TTN production, required for Unit Testing

if (typeof module !== 'undefined') {
    module.exports = {
        v2: Encoder,
        v3: encodeDownlink,
        SD01L_PAYLOAD_TYPE,
    };
}