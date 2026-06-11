// functions to sanitize the data 

function sanitizeUser({ _id, name, email, role}, accessToken) {

    return {
        id: _id,
        name,
        email,
        role,
        accessToken
    };

}

export { sanitizeUser};