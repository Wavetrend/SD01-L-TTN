/*
Wavetrend

SD01-L Water Temperature Monitor Payload Encoder for TTN

https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/
https://www.youtube.com/watch?v=nT2FnwCoP7w
*/

// const TYPE_INSTALL_REQUEST = 0
const TYPE_CONFIGURATION = 1
// const TYPE_INSTALL_RESPONSE = 2
// const TYPE_STANDARD_REPORT = 3
// const TYPE_AMBIENT_REPORT = 4
// const TYPE_SCALD_REPORT = 5
// const TYPE_FREEZE_REPORT = 6
// const TYPE_LOW_BATTERY_REPORT_DEPRECATED = 7
// const TYPE_SENSOR_ERROR_REPORT = 8
// const TYPE_GENERAL_ERROR_REPORT = 9
// const TYPE_SENSOR_DATA_DEBUG = 10

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

function Encode_SD01L_Payload(object) {
    let bytes = Encode_SD01L_PayloadHeader(object);

    switch (object.type) {
        case TYPE_CONFIGURATION:
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

// TTN V3
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

function Encoder(object /*, port */) {
    try {
        return Encode_SD01L_Payload(object);
    } catch {
        return [];
    }
}

// NB: Not used for TTN production, required for Unit Testing

module.exports = {
    v2: Encoder,
    v3: encodeDownlink,
};