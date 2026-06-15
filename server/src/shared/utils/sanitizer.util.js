// functions to sanitize the data 

// Function to sanitize user
export const sanitizeUser = ({ _id, name, email, role, isVerified, provider, avatar }, accessToken) => ({
    id: _id,
    name,
    email,
    role,
    isVerified,
    provider: provider || "local",
    avatar: avatar || null,
    accessToken
})

// Function to sanitize one series
export const sanitizeSeries = (series) => ({
    id: series._id,
    name: series.name,
    shortName: series.shortName,
    season: series.season,
    status: series.status,
    logo: series.logo,
    updatedAt: series.updatedAt
})

// Function to sanitize array of series 
export const sanitizeSeriesList = (serieses) => serieses.map((series) => sanitizeSeries(series))

// Function to sanitize Match data
export const sanitizeMatch = (match) => ({
    
})
// Function to sanitize Array of Matches