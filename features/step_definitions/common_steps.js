const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { decodeUplink } = require("../../src/uplink");
const { encodeDownlink, decodeDownlink } = require("../../src/downlink");
const { propertyMap } = require('./property_map')

Before(function () {
    this.encoded = []
    this.decoded = {}
    delete this.actual
})

Given("a {word} of {valueType}", function (property, value) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property].must.have.property('encode')
    propertyMap[this.decoded.type][property].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property].encode(this.encoded, value)
    this.decoded = propertyMap[this.decoded.type][property].decode(this.decoded, value)
})

Given("a sensor {int} {word} of {valueType}", function (sensor, property, value) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property][sensor-1].must.have.property('encode')
    propertyMap[this.decoded.type][property][sensor-1].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property][sensor-1].encode(this.encoded, value)
    this.decoded = propertyMap[this.decoded.type][property][sensor-1].decode(this.decoded, value)
})

Given("an empty payload header", function () {
    this.encoded = [
        0x00,                       // 00 - type
        0x00,                       // 01 - version
        0x00,                       // 02 - sequence
        0x00, 0x00, 0x00, 0x00,     // 03 - timestamp
    ]

    this.decoded = {
        type: 0,
        version: 0,
        sequence: 0,
        timestamp: 0,
    }
})

Given("the payload type is {int}", function (type) {
    this.encoded[0] = type
    this.decoded.type = type
})

When("the uplink is decoded", function () {
    this.actual = decodeUplink({ bytes: this.encoded, fPort: this.fPort || 1 })
})

When("the downlink is encoded", function () {
    this.actual = encodeDownlink({ data: this.decoded });
})

When("the downlink is decoded", function () {
    this.actual = decodeDownlink({ bytes: this.encoded, fPort: 1 });
})

Then("the decode is successful", function () {
    this.actual.must.eql({
        data: this.decoded,
        warnings: [],
        errors: [],
    })
})

Then("the encode is successful", function () {
    this.actual.must.eql({
        bytes: this.encoded,
        fPort: this.fPort || 1,
        warnings: [],
        errors: [],
    })
})

Then(/the (decode|encode) errors with "([^"]*)"$/, function (coding, message) {
    this.actual.must.eql({
        errors: [message],
        warnings: []
    })
})
