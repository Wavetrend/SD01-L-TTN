/**
 * Transform TTN Uplink Decoder output into Tago.io compatible
 * @param {object} object - Output from Decode_SD01L_Payload
 * @param {number} serie - Unique identifier for data
 * @return {{ variable: string, value: string, serie: string}[]}
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
            switch (object.version) {
                case 1:
                    result = tagoAdaptStandardReport(object)
                    break
                default:
                    throw "Unsupported standard report version"
            }
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
    let payload = [
        {   variable: "type",       value: object.type                      },
        {   variable: "version",    value: object.version                   },
        {   variable: "sequence",   value: object.sequence                  },
        {   variable: "timestamp",  value: object.timestamp                 },
    ]

    payload = object.current.sensor.reduce((acc, sensor, index) => {
        if (sensor.minC !== 127 && sensor.maxC !== -128) {
            return acc.concat([
                {   variable: `s${index+1}_minC`, value: sensor.minC          },
                {   variable: `s${index+1}_maxC`, value: sensor.maxC          },
                {   variable: `s${index+1}_events`, value: sensor.events      },
                {   variable: `s${index+1}_reports`, value: sensor.reports    },
            ])
        }
        return acc
    }, payload);

    return payload
}

if (module !== undefined) {
    module.exports.tagoAdapter = tagoAdapter
}