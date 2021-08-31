const Axios = require('axios');
exports.postVodAds = (req, res) => {
    // let {ad_tag_source, source, source_id} = req.body;

    // Axios.post(`http://10.0.1.70:3007/vodAd?ad_tag_source=${ad_tag_source}&source=${source}&source_id=${source_id}`)
    // .then(data => {
    //     res.json({status: "Record Inserted Successfully"});
    //     console.log("VOD Ad Impression Recorded")})
    res.send('Code commented');
}

exports.getVodAds = (req, res) => {
    // const { source, ad_tag_source, startDate, endDate } = req.query;

    // Axios.get(`http://10.0.1.70:3007/vodAd?ad_tag_source=${ad_tag_source}&source=${source}&startDate=${startDate}&endDate=${endDate}`)
    // .then(data => {
    //     res.send(data.data);
    // })
    res.send('Code commented');
}

exports.postLiveAds = (req, res) => {
    // let {ad_tag_source, source, source_id} = req.body;

    // Axios.post(`http://10.0.1.70:3007/liveAd?ad_tag_source=${ad_tag_source}&source=${source}&source_id=${source_id}`)
    // .then(data => {
    //     res.json({status: "Record Inserted Successfully"});
    //     console.log("Live Ad Impression Recorded")})
    res.send('Code commented');
        
}
exports.getLiveAds = (req, res) => {
    // const { source, ad_tag_source, startDate, endDate } = req.query;

    // Axios.get(`http://10.0.1.70:3007/liveAd?ad_tag_source=${ad_tag_source}&source=${source}&startDate=${startDate}&endDate=${endDate}`)
    // .then(data => {
    //     res.send(data.data);
    // })
    res.send('Code commented');
}