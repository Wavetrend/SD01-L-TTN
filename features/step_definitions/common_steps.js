const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { decodeUplink, Decoder } = require("../../src/uplink");
const { encodeDownlink, decodeDownlink, Encoder } = require("../../src/downlink");
const { propertyMap } = require('./property_map')
const expect = require('must')

Before(function () {
    this.encoded = []
    this.decoded = {}
    delete this.v2actual
    delete this.v3actual
})

Given("the encoded data has the structure:", function (table){
    this.encoded = table.hashes().reduce((data, row) => {
        [...row.Data.matchAll(/0x(?<hex>[0-9A-Fa-f]+)|(?<dec>[0-9]+)/g)].forEach(match => {
            /* istanbul ignore else */
            if (match.groups.hex) {
                data.push(parseInt(match.groups.hex, 16))
            } else if (match.groups.dec) {
                data.push(parseInt(match.groups.dec, 10))
            }
        })
        return data
    }, [])
})

Given("the decoded data has the structure:", function (json) {
    this.decoded = JSON.parse(json)
})

Given("a {word} of {valueType}", function (property, value) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property].must.have.property('encode')
    propertyMap[this.decoded.type][property].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property].encode(this.encoded, value)
    this.decoded = propertyMap[this.decoded.type][property].decode(this.decoded, value)
})

Given("a {word} of {string}", function (property, string) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property].must.have.property('encode')
    propertyMap[this.decoded.type][property].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property].encode(this.encoded, string)
    this.decoded = propertyMap[this.decoded.type][property].decode(this.decoded, string)
})

Given("a sensor {int} {word} of {valueType}", function (sensor, property, value) {
    propertyMap.must.have.property(this.decoded.type)
    propertyMap[this.decoded.type].must.have.property(property)
    propertyMap[this.decoded.type][property][sensor-1].must.have.property('encode')
    propertyMap[this.decoded.type][property][sensor-1].must.have.property('decode')
    this.encoded = propertyMap[this.decoded.type][property][sensor-1].encode(this.encoded, value)
    this.decoded = propertyMap[this.decoded.type][property][sensor-1].decode(this.decoded, value)
})

Given("the payload type is {int}", function (type) {
    this.encoded[0] = type
    this.decoded.type = type
})

Given("the payload version is {int}", function (version) {
    this.encoded[1] = version
    this.decoded.version = version
})

When("the uplink is decoded", function () {
    this.v3actual = decodeUplink({ bytes: this.encoded, fPort: this.fPort || 1 })
    this.v2actual = Decoder(this.encoded, this.fPort || 1 )
})

When("the downlink is encoded", function () {
    this.v3actual = encodeDownlink({ data: this.decoded });
    this.v2actual = Encoder(this.decoded);
})

When("the downlink is decoded", function () {
    this.v3actual = decodeDownlink({ bytes: this.encoded, fPort: 1 });
    this.v2actual = undefined
})

Then("the decode is successful", function () {
    // noinspection JSCheckFunctionSignatures
    expect(this.v3actual, "V3 Actual").must.eql({
        data: this.decoded,
        warnings: [],
        errors: [],
    })
    // noinspection JSCheckFunctionSignatures
    expect(this.v2actual, "V2 Actual").must.eql(this.decoded)
})

Then("the v3 decode is successful", function () {
    // noinspection JSCheckFunctionSignatures
    expect(this.v3actual, "V3 Actual").must.eql({
        data: this.decoded,
        warnings: [],
        errors: [],
    })
})

Then("the v2 decode is undefined", function () {
    // noinspection JSCheckFunctionSignatures
    expect(this.v2actual, "V2 Actual").must.undefined()
})

Then("the v2 decode is null", function () {
    // noinspection JSCheckFunctionSignatures
    expect(this.v2actual, "V2 Actual").must.be.null()
})

Then("the encode is successful", function () {
    // noinspection JSCheckFunctionSignatures
    expect(this.v3actual, "V3 Actual").must.eql({
        bytes: this.encoded,
        fPort: this.fPort || 1,
        warnings: [],
        errors: [],
    })
    this.v2actual.must.eql(this.encoded)
})

Then(/the (?:decode|encode) errors with "([^"]*)"$/, function (message) {
    // noinspection JSCheckFunctionSignatures
    expect(this.v3actual, "V3 Actual").must.eql({
        errors: [message],
        warnings: []
    })
    // noinspection JSCheckFunctionSignatures
    expect(this.v2actual, "V2 Actual").must.eql([])
})

Then(/the v3 (?:encode|decode) errors with "([^"]*)"$/, function (message) {
    // noinspection JSCheckFunctionSignatures
    expect(this.v3actual, "V3 Actual").must.eql({
        errors: [message],
        warnings: []
    })
})

