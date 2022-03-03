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

When("the uplink decoder is called", function () {
    this.actual = decodeUplink({ bytes: this.encoded, fPort: this.fPort || 1 })
})

When("the downlink encoder is called", function () {
    this.actual = encodeDownlink({ data: this.decoded });
})

When("the downlink decoder is called", function () {
    this.actual = decodeDownlink({ bytes: this.encoded, fPort: 1 });
})

Then("it should be decoded", function () {
    this.actual.must.eql({
        data: this.decoded,
        warnings: [],
        errors: [],
    })
})

Then("it should be encoded", function () {
    this.actual.must.eql({
        bytes: this.encoded,
        fPort: this.fPort || 1,
        warnings: [],
        errors: [],
    })
})