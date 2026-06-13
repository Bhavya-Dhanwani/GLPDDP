// functions to sanitize the data 

export const sanitizeUser = ({ _id, name, email, role, isVerified }, accessToken) => ({
    id: _id,
    name,
    email,
    role,
    isVerified,
    accessToken
})

export const sanitizeSeries = (series) => ({
    id: series._id,
    name: series.name,
    shortName: series.shortName,
    season: series.season,
    status: series.status,
    logo: series.logo,
    updatedAt: series.updatedAt
})

export const sanitizeSeriesList = (serieses) => serieses.map((series) => sanitizeSeries(series))