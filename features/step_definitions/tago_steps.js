const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { tagoAdapter } = require('../../src/tago.adapter')

const expect = require('must')

Before(function () {
    delete this.tagoOutput
    delete this.tagoExpected
})

When("the TagO adapter transforms", function() {
    this.tagoOutput = tagoAdapter(this.decoded, 1)
})

Given("the TagO output has the structure:", function(json) {
    this.tagoExpected = JSON.parse(json)
})

Given("the TagO {word} has the value {valueType}", function(property, value) {

    this.tagoExpected = this.tagoExpected.map(item => {
        if (property === 'sensor_id') {
            item.variable = item.variable.replace('1', value + 1)
        }
        if (item.variable === property
            || item.variable.match(`^s\\d_${property}$`)
        ) {
            item.value = String(value)
        }
        return item
    })

    this.decoded[property] = value
})

Then("the TagO transform is successful", function() {
    expect(this.tagoExpected).must.eql(this.tagoOutput)
})