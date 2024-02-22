const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const genneralAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30m' })

    return access_token
}

const genneralRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })

    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    resolve({
                        status: 'ERR',
                        message: 'Refresh token has expired'
                    });
                } else {
                    resolve({
                        status: 'ERR',
                        message: 'Invalid refresh token'
                    });
                }
            } else {
                const access_token = await genneralAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                });
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                });
            }
        });
    });
}


module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}