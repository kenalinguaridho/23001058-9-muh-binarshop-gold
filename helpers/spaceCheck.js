const spaceChecker = stringValue => {
    for (let i = 0; i < stringValue.length; i++) {
        if (stringValue[i] === " ") {
            return false
        }

    }

    return true
}

module.exports = { spaceChecker }