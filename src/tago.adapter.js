/**
 * @namespace TagO.Adapter
 */

/**
 * TagO Data Item
 * @typedef {Object} TagO.Adapter.Item
 * @property {string} variable - The name of the variable
 * @property {string} value - The value of the variable
 * @property {string} serie - The series for the variable
 */

/**
 * Transform TTN Uplink Decoder output into Tago.io compatible
 * @param {object} object - Output from Decode_SD01L_Payload
 * @param {number} serie - Unique identifier for data
 * @returns {TagO.Adapter.Item[] } - Array of variables
 * @example
 * const uplink_payload = [] // fill with raw bytes
 * const decoded = Decode_SD01L_Payload(uplink_payload)
 * const serie = 0 // unique identifier
 * const tago_data = tagoAdapter(decoded, serie)
 */
function tagoAdapter(object, serie) {
    let result = []
    switch (object.type) {
        case 3:     // standard report
            result = tagoAdaptStandardReport(object)
            break
        default:
            throw "Unsupported payload type"
    }

    // add serie to each element, and convert value to strings
    return result.map(addSerie.bind(null, serie)).map(stringifyValues)
}

function addSerie(serie, data) {
    return Object.assign({}, data, { serie: String(serie) })
}

function stringifyValues(data) {
    return Object.assign({}, data, { value: String(data.value) })
}

function tagoAdaptStandardReport(object) {
    if (object.minC !== 127 && object.maxC !== -128) {
        return [
            {variable: "type", value: object.type},
            {variable: "timestamp", value: object.timestamp},
            {variable: `s${object.sensor_id + 1}_minC`, value: object.minC},
            {variable: `s${object.sensor_id + 1}_maxC`, value: object.maxC},
            {variable: `s${object.sensor_id + 1}_events`, value: object.events},
            {variable: `s${object.sensor_id + 1}_reports`, value: object.reports},
        ]
    }
    return []
}

if (module !== undefined) {
    module.exports.tagoAdapter = tagoAdapter
}