const Axios = require('axios');
exports.postVodAds = (req, res) => {
    let {view_date, AdTag, source, source_id} = req.body;

    Axios.post(`http://18.196.7.106:3007/vodAd?view_date=${view_date}&AdTag=${AdTag}&source=${source}&source_id=${source_id}`)
    .then(res.send("Posted"))
}

exports.postLiveAds = (req, res) => {
    let {view_date, AdTag, source, source_id} = req.body;

    Axios.post(`http://18.196.7.106:3007/liveAd?view_date=${view_date}&AdTag=${AdTag}&source=${source}&source_id=${source_id}`)
    .then(res.send("Posted"))
}