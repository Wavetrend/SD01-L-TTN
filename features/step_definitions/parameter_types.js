const {defineParameterType} = require("@cucumber/cucumber");

defineParameterType({
    name: 'valueType',
    regexp: /0x[0-9A-Fa-f]+|-?\d+(?:\.\d+)?|null|true|false/,
    transformer(value) {
        switch (value) {
            case 'true':
                return true
            case 'false':
                return false
            case 'null':
                return null
            default:
                if (value.includes('.')) {
                    return parseFloat(value)
                }
                return parseInt(value)
        }
    }
});

