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
    return [
        {   variable: "type",       value: object.type                      },
        {   variable: "version",    value: object.version                   },
        {   variable: "sequence",   value: object.sequence                  },
        {   variable: "timestamp",  value: object.timestamp                 },
        {   variable: "s1_minC",    value: object.current.sensor[0].minC    },
        {   variable: "s1_maxC",    value: object.current.sensor[0].maxC    },
        {   variable: "s1_events",  value: object.current.sensor[0].events  },
        {   variable: "s1_reports", value: object.current.sensor[0].reports },
        {   variable: "s2_minC",    value: object.current.sensor[1].minC    },
        {   variable: "s2_maxC",    value: object.current.sensor[1].maxC    },
        {   variable: "s2_events",  value: object.current.sensor[1].events  },
        {   variable: "s2_reports", value: object.current.sensor[1].reports },
        {   variable: "s3_minC",    value: object.current.sensor[2].minC    },
        {   variable: "s3_maxC",    value: object.current.sensor[2].maxC    },
        {   variable: "s3_events",  value: object.current.sensor[2].events  },
        {   variable: "s3_reports", value: object.current.sensor[2].reports },
    ]
}

if (module !== undefined) {
    module.exports.tagoAdapter = tagoAdapter
}