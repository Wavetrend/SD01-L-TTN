/*
Wavetrend

SD01-L Water Temperature Monitor Payload Decoder for TTN

https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/
*/

const TYPE_INSTALL_REQUEST = 0
const TYPE_CONFIGURATION = 1
const TYPE_INSTALL_RESPONSE = 2
const TYPE_STANDARD_REPORT = 3
const TYPE_AMBIENT_REPORT = 4
const TYPE_SCALD_REPORT = 5
const TYPE_FREEZE_REPORT = 6
const TYPE_LOW_BATTERY_REPORT_DEPRECATED = 7
const TYPE_SENSOR_ERROR_REPORT = 8
const TYPE_GENERAL_ERROR_REPORT = 9
const TYPE_SENSOR_DATA_DEBUG = 10

const OFFSET_TYPE = 0
const OFFSET_VERSION = 1
const OFFSET_SEQUENCE = 2
const OFFSET_TIMESTAMP = 3

function Decode_SD01L_PayloadHeader(data) {
    let i;
    let obj = { data: [] };

    for(i=0 ; i < data.length ; i++) {
        switch (i) {
            case OFFSET_TYPE:
                obj.type = data[i];
                break;
            case OFFSET_VERSION:
                obj.version = data[i];
                break;
            case OFFSET_SEQUENCE:
                obj.sequence = data[i];
                break;
            case OFFSET_TIMESTAMP:
                obj.timestamp = (data[i++]*2**24)+(data[i++]*2**16)+(data[i++]*2**8)+data[i];
                break;
            default:
                obj.data = data.slice(i)
                i = data.length
        }
    }
    return obj;
}

function Decode_SD01L_Payload(data) {
    let obj = Decode_SD01L_PayloadHeader(data);
    data = obj.data;
    delete obj.data;
    let i = 0

    switch (obj.type) {
        case TYPE_INSTALL_REQUEST:
            if (obj.version === 4) {
                obj.nonce = (data[i++] * 2 ** 24) + (data[i++] * 2 ** 16) + (data[i++] * 2 ** 8) + data[i++];
                obj.battery_mV = (data[i++] * 2 ** 8) + data[i++];
                obj.temperature = [];
                for (let sensor = 0; sensor < 3; sensor++) {
                    let temp_index = (data[i++] * 2 ** 8) + data[i++];
                    obj.temperature[sensor] = (temp_index - 270) / 10
                }
                obj.reset_reason = (data[i++] * 2 ** 8) + data[i++];
            }
            break;

        case TYPE_INSTALL_RESPONSE:
            if (obj.version === 3) {
                obj.error_code = data[i++]
            }
            break;

        case TYPE_STANDARD_REPORT:
            if (obj.version === 1) {
                obj.current = { sensor: [] };
                for (let sensor = 0; sensor < 3; sensor++) {
                    obj.current.sensor[sensor] = {
                        minC: data[i++],
                        maxC: data[i++],
                        events: data[i++],
                        reports: data[i++],
                    };
                }
                obj.history = [];
                for (let history = 0; history < 2 && i < data.length; history++) {
                    obj.history[history] = {
                        timestamp: (data[i++] * 2 ** 24) + (data[i++] * 2 ** 16) + (data[i++] * 2 ** 8) + data[i++],
                        sensor: [],
                    };
                    for (let sensor = 0; sensor < 3; sensor++) {
                        obj.history[history].sensor[sensor] = {
                            minC: data[i++],
                            maxC: data[i++],
                            events: data[i++],
                            reports: data[i++],
                        };
                    }
                }
            }
            break;

        case TYPE_AMBIENT_REPORT:
            if (obj.version === 1) {
                obj.minC = data[i++];
                obj.maxC = data[i++];
                obj.avgC = data[i++];
            }
            break;

        case TYPE_FREEZE_REPORT:
        case TYPE_SCALD_REPORT:
            if (obj.version === 1) {
                obj.sensor = data[i++];
                obj.temperature = data[i++];
            }
            break;

        case TYPE_SENSOR_ERROR_REPORT:
            if (obj.version === 1) {
                obj.sensor = [];
                for (let sensor = 0; sensor < 3; sensor++) {
                    obj.sensor[sensor] = data[i++]
                }
            }
            break;

        case TYPE_GENERAL_ERROR_REPORT:
            if (obj.version === 1) {
                obj.error_code = data[i++];
                obj.file = "";
                for (let pos = 0, append = true; pos < 32; pos++) {
                    if (append && data[i] !== 0) {
                        obj.file += data[i++];
                    } else {
                        append = false;
                        i++;
                    }
                }
                obj.line = (data[i++] * 2 ** 8) + data[i++];
            }
            break;

        case TYPE_CONFIGURATION:
            throw "Configuration type is not a valid uplink message";

        case TYPE_LOW_BATTERY_REPORT_DEPRECATED:
            throw "Low Battery Report is deprecated"

        case TYPE_SENSOR_DATA_DEBUG:
            throw "Sensor Data Debug is not supported for decode"

        default:
            throw "Unrecognised Type Code"
    }
    return obj;
}

// TTN V3
function decodeUplink(input) {
    let obj = {
        warnings: [],
        errors: [],
    }

    try {
        obj.data = Decode_SD01L_Payload(input.bytes);
    } catch (error) {
        obj.errors.push(error);
    }

    return obj;
}

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
};