const responseJSON = (data) => {
    let response = {
        data: data ? data:null,
        status: 'success'
    }

    return response
}

const dataPicker = (object, array) => {
    const result = {}

    for (let i = 0; i < array.length; i++) {
        if (array[i] in object) {
            result[array[i]] = object[array[i]]
        }
    }

    return result
}

module.exports = { responseJSON, dataPicker }