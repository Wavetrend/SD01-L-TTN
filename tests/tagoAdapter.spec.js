const { tagoAdapter }  = require('../src/tago.adapter')

describe('tagoAdapter', () => {

    test('Decodes Standard Report', () => {
        const payload = {
            type: 3,
            version: 1,
            sequence: 0,
            timestamp: 0x12345678,
            current: {
                sensor: [
                    {
                        minC: 20,
                        maxC: 21,
                        events: 1,
                        reports: 2,
                    },
                    {
                        minC: 22,
                        maxC: 23,
                        events: 3,
                        reports: 4,
                    },
                    {
                        minC: 24,
                        maxC: 25,
                        events: 5,
                        reports: 6,
                    },
                ]
            }
        }

        function randomInt(max=0xFFFFFFFF) {
            return Math.floor(Math.random()*max)
        }

        let serie = randomInt()
        const result = tagoAdapter(payload, serie)
        serie = String(serie)

        expect(result).toEqual([
            {   variable: 'type', value: '3', serie, },
            {   variable: 'version', value: '1', serie, },
            {   variable: 'sequence', value: '0', serie, },
            {   variable: 'timestamp', value: String(0x12345678), serie, },
            {   variable: 's1_minC', value: "20", serie, },
            {   variable: 's1_maxC', value: "21", serie, },
            {   variable: 's1_events', value: "1", serie, },
            {   variable: 's1_reports', value: "2", serie, },
            {   variable: 's2_minC', value: "22", serie, },
            {   variable: 's2_maxC', value: "23", serie, },
            {   variable: 's2_events', value: "3", serie, },
            {   variable: 's2_reports', value: "4", serie, },
            {   variable: 's3_minC', value: "24", serie, },
            {   variable: 's3_maxC', value: "25", serie, },
            {   variable: 's3_events', value: "5", serie, },
            {   variable: 's3_reports', value: "6", serie, },
        ])
    })
})