// const objectFinder = (param, jsonFile) => {
//     isIdFound = false

//     for (let i = 0; i < jsonFile.length; i++) {
//         if (jsonFile[i].param == param) {
//             isIdFound = true
//             break
//         }
//     }

// }

const idFinder = (id, jsonFile) => {
    
    const idFound = jsonFile.find(i => i.id === +id)

    if (idFound) {
        return true
    }

    return false
    
}

module.exports = { idFinder }