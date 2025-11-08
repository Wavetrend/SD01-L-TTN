const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { decodeUplink, Decoder } = require("../../src/uplink");
const { encodeDownlink, decodeDownlink, Encoder } = require("../../src/downlink");
const { uplinkPropertyMap, downlinkPropertyMap } = require('./property_map')
const expect = require('must')

Before(function () {
    this.encoded = []
    this.fPort = undefined
    this.isUplink = undefined
    this.decoded = {}
    this.flow_delta = undefined
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

Given("the uplink port is {int}", function(port) {
    this.fPort = port
    this.isUplink = true
})

Given("the downlink port is {int}", function(port) {
    this.fPort = port
    this.isUplink = false
})

Given("the decoded data has the structure:", function (json) {
    this.decoded = JSON.parse(json)
})

Given("a {word} of {valueType}", function (property, value) {
    let map = this.isUplink ? uplinkPropertyMap : downlinkPropertyMap
    map.must.have.property(this.fPort)
    map[this.fPort].must.have.property(property)
    map[this.fPort][property].must.have.property('encode')
    map[this.fPort][property].must.have.property('decode')
    this.encoded = map[this.fPort][property].encode(this.encoded, value)
    this.decoded = map[this.fPort][property].decode(this.decoded, value)
})

Given("a sensor {int} {word} of {valueType}", function (sensor, property, value) {
    let map = this.isUplink ? uplinkPropertyMap : downlinkPropertyMap
    map.must.have.property(this.fPort)
    map[this.fPort].must.have.property(property)
    map[this.fPort][property][sensor-1].must.have.property('encode')
    map[this.fPort][property][sensor-1].must.have.property('decode')
    this.encoded = map[this.fPort][property][sensor-1].encode(this.encoded, value)
    this.decoded = map[this.fPort][property][sensor-1].decode(this.decoded, value)
})

Given("a flow delta of {int} and {int}", function (hot, cold) {
    let map = this.isUplink ? uplinkPropertyMap : downlinkPropertyMap
    map.must.have.property(this.fPort)
    map[this.fPort].must.have.property('flow_delta')
    map[this.fPort]['flow_delta'].must.have.property('encode')
    map[this.fPort]['flow_delta'].must.have.property('decode')
    this.encoded = map[2]['flow_delta'].encode(this.encoded, { hot, cold })
    this.decoded = map[2]['flow_delta'].decode(this.decoded, { hot, cold })
})

When("the uplink is decoded", function () {
    this.v3actual = decodeUplink({ bytes: this.encoded, fPort: this.fPort || 1 })
    this.v3port = this.fPort || 1
    this.v2actual = Decoder(this.encoded, this.fPort || 1 )
    this.v2port = this.fPort || 1
})

When("the downlink is encoded", function () {
    this.v3actual = encodeDownlink({ data: this.decoded });
    this.v2actual = Encoder(this.decoded, this.fPort);
})

When("the downlink is decoded", function () {
    this.v3actual = decodeDownlink({ bytes: this.encoded, fPort: this.fPort });
    this.v2actual = undefined
})

Then("the decode is successful", function () {
    // noinspection JSCheckFunctionSignatures
    expect(this.v3actual, "V3 Actual").must.eql({
        data: this.decoded,
        warnings: [],
        errors: [],
    })
    expect(this.v3port).must.eql(this.fPort)
    // noinspection JSCheckFunctionSignatures
    expect(this.v2actual, "V2 Actual").must.eql(this.decoded)
    expect(this.v2port).must.eql(this.fPort)
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

