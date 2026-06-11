// functions to sanitize the data 

function sanitizeUser({ _id, name, email, role, isVerified }, accessToken) {

    return {
        id: _id,
        name,
        email,
        role,
        isVerified,
        accessToken
    };

}

export { sanitizeUser};