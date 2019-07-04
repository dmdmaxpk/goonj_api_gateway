const Axios = require('axios');
exports.postVodAds = (req, res) => {
    let {view_date, ad_tag_source, source, source_id} = req.body;

    Axios.post(`http://10.0.1.70:3007/vodAd?view_date=${view_date}&ad_tag_source=${ad_tag_source}&source=${source}&source_id=${source_id}`)
    .then(data => {
        res.send("Posted");
        console.log("VOD Ad Impression Recorded")})
}

exports.postLiveAds = (req, res) => {
    let {view_date, ad_tag_source, source, source_id} = req.body;

    Axios.post(`http://10.0.1.70:3007/liveAd?view_date=${view_date}&ad_tag_source=${ad_tag_source}&source=${source}&source_id=${source_id}`)
    .then(data => {
        res.send("Posted");
        console.log("Live Ad Impression Recorded")})
}