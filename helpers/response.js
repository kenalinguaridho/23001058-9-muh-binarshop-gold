const responseJSON = (data, status, message) => {
    
    let response = {
        data: data ? data:null,
        status: status ? status : 'success'
    }

    if(message && message != undefined && Object.keys(message).length != 0) response['message'] = message

    return response

}

module.exports = { responseJSON }