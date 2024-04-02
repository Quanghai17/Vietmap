const { parseError } = require('./error');
const axios = require('axios');
async function refeshtoken(refeshtoken) {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: process.env.URL_API + '/auth/refresh_token',
            headers: {
                'Authorization': 'Bearer ' + refeshtoken
            }
        };
        return await axios.request(config)
            .then((response) => {
                return response.data.tokenObj.token
            })
            .catch((error) => {
                const { code, message } = parseError(error)
                return { code, message };
            });
    } catch (err) {
        const { code, message } = parseError(error)
        return { code, message };
    }
}
module.exports = {
    refeshtoken,
};