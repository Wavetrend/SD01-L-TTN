/**
@file SD01-L Water Temperature Monitor Downlink Payload Formatter for TTN
@module src/downlink.js
@author Dave Meehan
@copyright Wavetrend Europe Ltd
@see {@link https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/}
@see {@link https://www.youtube.com/watch?v=nT2FnwCoP7w}
*/

/**
 * @namespace Wavetrend.SD01L
 */

/**
 * Wavetrend SD01L Payload Type
 * @typedef {number} Wavetrend.SD01L.PayloadType
 * @readonly
 * @memberOf Wavetrend.SD01L
 * @enum {Wavetrend.SD01L.PayloadType}
 * @property {Wavetrend.SD01L.PayloadType} INSTALL_REQUEST - 0
 * @property {Wavetrend.SD01L.PayloadType} CONFIGURATION - 1
 * @property {Wavetrend.SD01L.PayloadType} INSTALL_RESPONSE - 2
 * @property {Wavetrend.SD01L.PayloadType} STANDARD_REPORT - 3
 * @property {Wavetrend.SD01L.PayloadType} AMBIENT_REPORT - 4
 * @property {Wavetrend.SD01L.PayloadType} SCALD_REPORT - 5
 * @property {Wavetrend.SD01L.PayloadType} FREEZE_REPORT - 6
 * @property {Wavetrend.SD01L.PayloadType} LOW_BATTERY_REPORT_DEPRECATED - 7
 * @property {Wavetrend.SD01L.PayloadType} SENSOR_ERROR_REPORT - 8
 * @property {Wavetrend.SD01L.PayloadType} GENERAL_ERROR_REPORT - 9
 * @property {Wavetrend.SD01L.PayloadType} SENSOR_DATA_DEBUG - 10
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
 * @typedef {Object} Wavetrend.SD01L.PayloadHeader
 * @property {Wavetrend.SD01L.PayloadType} type - payload type
 * @property {number} version - message payload version 0-255
 * @property {number} sequence - message payload sequence 0-255
 * @property {number} timestamp - seconds since Unix epoch
 */

/**
 * @typedef {Object} Wavetrend.SD01L.MessageFlags
 * @property {boolean} scald - scald reporting enabled (default disabled)
 * @property {boolean} freeze - freeze reporting enabled (default disabled)
 * @property {boolean} ambient - ambient reporting enabled (default disabled)
 * @property {boolean} debug - debug reporting enabled (default disabled)
 * @property {number} history_count - number of history messages in standard report (default = 0, otherwise 1 or 2)
 */

/**
 * SD01L Sensor Configuration Type
 * @typedef {number} Wavetrend.SD01L.SensorType
 * @readonly
 * @enum {number}
 * @memberOf Wavetrend.SD01L
 * @property {Wavetrend.SD01L.SensorType} Disabled - 0
 * @property {Wavetrend.SD01L.SensorType} HotOutletStandard - 1
 * @property {Wavetrend.SD01L.SensorType} HotOutletHealthcare - 2
 * @property {Wavetrend.SD01L.SensorType} ColdOutlet - 3
 * @property {Wavetrend.SD01L.SensorType} ColdUnitRising - 4
 * @property {Wavetrend.SD01L.SensorType} BlendedRisingScaldCheck - 5
 * @property {Wavetrend.SD01L.SensorType} HotUnitOutletFalling - 6
 * @property {Wavetrend.SD01L.SensorType} HotUnitReturnFalling - 7
 * @property {Wavetrend.SD01L.SensorType} HotUnitReturnHealthcareFalling - 8
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
 * @typedef {Object} Wavetrend.SD01L.SensorConfig
 * @property {number} flow_settling_count - number of readings to allow flow to settle (default 0)
 * @property {SD01L_SENSOR_TYPE} config - identity of the sensor configuration (default disabled)
 */

/**
 * @typedef {Wavetrend.SD01L.PayloadHeader} Wavetrend.SD01L.Configuration
 * @property {number} nonce - same value as contained in the installation request
 * @property {number} downlink_hours - number of hours between configuration requests (default 24)
 * @property {Wavetrend.SD01L.MessageFlags} message_flags - option flags
 * @property {number} scald_threshold - temperature above which scald reports will be sent (if enabled, default 60)
 * @property {number} freeze_threshold - temperature below which freeze reports will be sent (if enabled, default 4)
 * @property {number} reporting_period - number of minutes between reports (default 60)
 * @property {Wavetrend.SD01L.SensorConfig[]} config_type - configuration for each sensor
 */

/**
 * @typedef {Wavetrend.SD01L.Configuration} Wavetrend.SD01L.DownlinkPayloads
 */

/**
 * Deep merge of config objects to allow defaults to be supplied for anything missing
 * @param {*} arg1
 * @param {*} arg2
 * @returns {*}
 * @memberOf Wavetrend.SD01L
 */
function mergeConfigs(arg1, arg2) {

    if ((Array.isArray(arg1) && Array.isArray(arg2))
        || (typeof arg1 === 'object' && typeof arg2 === 'object')) {
        for (let key in arg2) {
            arg1[key] = mergeConfigs(arg1[key], arg2[key]);
        }
        return arg1;
    }
    return arg2;
}

/**
 * Encode the common header fields
 * @param {Wavetrend.SD01L.DownlinkPayloads} object
 * @returns {number[]} - header fields encoded to byte array
 * @memberOf Wavetrend.SD01L
 */
function Encode_SD01L_PayloadHeader(object) {
    return [
        object.type,
        object.version,
        object.sequence,
        (object.timestamp & 0xFF000000) >>> 24,
        (object.timestamp & 0x00FF0000) >>> 16,
        (object.timestamp & 0x0000FF00) >>> 8,
        (object.timestamp & 0x000000FF),
    ]
}

/**
 * Encode SD01L specific message payloads
 * @param {Wavetrend.SD01L.DownlinkPayloads} object
 * @returns {number[]} - array of encoded bytes
 * @memberOf Wavetrend.SD01L
 */
function Encode_SD01L_Payload(object) {
    let bytes = Encode_SD01L_PayloadHeader(object);

    switch (object.type) {
        case SD01L_PAYLOAD_TYPE.CONFIGURATION:
            if (object.version !== 3) {
                throw 'Unsupported configuration version ' + object.version;
            }
            const defaults = {
                nonce: 0,
                downlink_hours: 24,
                message_flags: {
                    scald: false,
                    freeze: false,
                    ambient: false,
                    history_count: 0,
                },
                scald_threshold: 60,
                freeze_threshold: 4,
                reporting_period: 60,
                config_type: [
                    {flow_settling_count: 0, config: 0,},
                    {flow_settling_count: 0, config: 0,},
                    {flow_settling_count: 0, config: 0,},
                ]
            };
            object = mergeConfigs(defaults, object);

            bytes.push((object.nonce & 0xFF000000) >>> 24);
            bytes.push((object.nonce & 0x00FF0000) >>> 16);
            bytes.push((object.nonce & 0x0000FF00) >>> 8);
            bytes.push(object.nonce & 0x000000FF);
            bytes.push(object.downlink_hours & 0xFF);
            bytes.push(
                object.message_flags.scald << 0 >>> 0
                | object.message_flags.freeze << 1 >>> 0
                | object.message_flags.ambient << 2 >>> 0
                | object.message_flags.debug << 3 >>> 0
                | (object.message_flags.history_count & 0x03) << 5 >>> 0
            );
            bytes.push((object.scald_threshold & 0xFF) >>> 0);
            bytes.push((object.freeze_threshold & 0xFF) >>> 0);
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
                throw "Unrecognised type for downlink encoding";
            }
            throw "Unsupported type for downlink encoding";
    }
    return bytes;
}

/**
 * @namespace TTN.Downlink
 */

/**
 * @typedef {Object} TTN.Downlink.EncoderInput
 * @property {Wavetrend.SD01L.DownlinkPayloads} data
 */

/**
 * @typedef {Object} TTN.Downlink.EncoderSuccess
 * @property {number[]} bytes - byte array of encoded data
 * @property {number} fPort - LoRaWAN port number
 * @property {string[]} [warnings] - any warnings encountered during encoding
 */

/**
 * @typedef {Object} TTN.Downlink.EncoderError
 * @property {string[]} errors - any errors encountered during encoding
 */

/**
 * @typedef {TTN.Downlink.EncoderSuccess|TTN.Downlink.EncoderError} TTN.Downlink.EncoderOutput
 */

/**
 * Entry point for TTN V3 downlink encoder
 * @param {TTN.Downlink.EncoderInput} input
 * @returns {TTN.Downlink.EncoderOutput}
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
 * @param {Wavetrend.SD01L.DownlinkPayloads} object
 * @returns {number[]} - byte array of encoded payload or empty array
 */
function Encoder(object /*, port */) {
    try {
        return Encode_SD01L_Payload(object);
    } catch (e) {
        return [];
    }
}

/**
 * Decode SD01L specific payloads
 * @param {number[]} bytes
 * @return {Wavetrend.SD01L.DownlinkPayloads}
 * @memberOf Wavetrend.SD01L
 */
function Decode_SD01L_Payload(bytes) {

    let i = 0;
    let object = {
        type: (bytes[i++] & 0xFF) >>> 0,
        version: (bytes[i++] & 0xFF) >>> 0,
        sequence: (bytes[i++] & 0xFF) >>> 0,
        timestamp:
            ((bytes[i++] & 0xFF) << 24 >>> 0)
            + ((bytes[i++] & 0xFF) << 16 >>> 0)
            + ((bytes[i++] & 0xFF) << 8 >>> 0)
            + ((bytes[i++] & 0xFF) >>> 0)
    };

    switch (object.type) {
        case SD01L_PAYLOAD_TYPE.CONFIGURATION:
            if (object.version !== 3) {
                throw "Unsupported configuration version " + object.version;
            }

            object.nonce =
                ((bytes[i++] & 0xFF) << 24 >>> 0)
                + ((bytes[i++] & 0xFF) << 16 >>> 0)
                + ((bytes[i++] & 0xFF) << 8 >>> 0)
                + ((bytes[i++] & 0xFF) >>> 0);

            object.downlink_hours = (bytes[i++] & 0xFF) >>> 0;
            let flags = (bytes[i++] & 0xFF) >>> 0;
            object.message_flags = {
                scald: (flags & 0x01) === 0x01,
                freeze: (flags & 0x02) === 0x02,
                ambient: (flags & 0x04) === 0x04,
                debug: (flags & 0x08) === 0x08,
                history_count: (flags >>> 5) & 0x03,
            };

            object.scald_threshold = (bytes[i++] & 0xFF) << 24 >> 24;
            object.freeze_threshold = (bytes[i++] & 0xFF) << 24 >> 24;
            object.reporting_period =
                ((bytes[i++] & 0xFF) << 8 >>> 0)
                + ((bytes[i++] & 0xFF) >>> 0);

            object.config_type = [];
            for (let sensor = 0; sensor < 3; sensor++) {
                let config = (bytes[i++] & 0xFF) >>> 0;
                object.config_type[sensor] = {
                    flow_settling_count: (config >>> 4) & 0x0F >>> 0,
                    config: (config & 0x0F) >>> 0,
                };
            }
            break;

        default:
            if (object.type > 10) {
                throw "Unrecognised type for downlink decoding";
            }
            throw "Unsupported type for downlink decoding";
    }

    return object;
}

/**
 * @typedef {Object} TTN.Downlink.DecoderInput
 * @property {number[]} bytes - byte array of encoded data
 * @property {number} fPort - LoRaWAN port number
 */

/**
 * @typedef {Object} TTN.Downlink.DecoderSuccess
 * @property {Wavetrend.SD01L.DownlinkPayloads} data
 * @property {string[]} [warnings]
 */

/**
 * @typedef {Object} TTN.Downlink.DecoderError
 * @property {string[]} errors
 */

/**
 * @typedef {TTN.Downlink.DecoderSuccess|TTN.Downlink.DecoderError} TTN.Downlink.DecoderOutput
 */

/**
 * Entry point for TTN V3 downlink decoder (inverse of encodeDownlink)
 * @param {TTN.Downlink.DecoderInput} input
 * @returns {TTN.Downlink.DecoderOutput}
 */
function decodeDownlink(input) {
    let payload = {
        warnings: [],
        errors: [],
    };

    try {
        payload.data = Decode_SD01L_Payload(input.bytes);
    } catch (e) {
        delete payload.data;
        payload.errors.push(e);
    }

    return payload;
}

// NB: Not used for TTN production, required for Unit Testing

/* istanbul ignore else */
if (typeof module !== 'undefined') {
    module.exports = {
        Encoder,
        encodeDownlink,
        decodeDownlink,
        SD01L_PAYLOAD_TYPE,
        mergeConfigs,
    };
}