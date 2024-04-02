const { refeshtoken} = require('./global');
const { parseError } = require('./error');
const axios = require('axios');
const timetoken = {
    expires: new Date(
        Date.now() + 10 * 60 * 1000
    ),
    httpOnly: true
}
exports.mapekmap = async (req, res) => {
    if (req.cookies.token) {
        var token = req.cookies.token
    } else {
        var tokenrf = req.cookies.refreshtoken;
        var token = await refeshtoken(tokenrf);
        res.cookie('token', token, timetoken);
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.URL_API + '/city/cities',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    };
    await axios.request(config)
        .then((response) => {
            let listlocation = response.data
            //res.json(listlocation);
            res.render('pages/maps3', {  lang: req.cookies.lang, cities: JSON.stringify(listlocation),});

        })
        .catch((error) => {
            const { code, message } = parseError(error)
            res.json({ code, message });
        });
}
