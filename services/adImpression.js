const Axios = require('axios');
exports.postVodAds = (req, res) => {
    let {view_date, AdTag, source, source_id} = req.body;

    Axios.post(`http://localhost:3007/vodAd?view_date=${view_date}&AdTag=${AdTag}&source=${source}&source_id=${source_id}`)
    .then(data =>{
        res.send("Posted");
    })
}

exports.postLiveAds = (req, res) => {
    let {view_date, AdTag, source, source_id} = req.body;

    Axios.post(`http://localhost:3007/liveAd?view_date=${view_date}&AdTag=${AdTag}&source=${source}&source_id=${source_id}`)
    .then(data =>{
        res.send("Posted");
    })
}