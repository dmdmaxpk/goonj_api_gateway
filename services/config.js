exports.settings = async (req, res) => {
    let data = {
        live_url: 'http://live.pockettv.com.pk:1936/live',
        vod_url: 'http://live.pockettv.com.pk:555/curation',
        api_url: 'http://192.168.10.121:3002',
        cdn_static: 'http://cloudfront.com',
        terms_url: 'https://api.goonj.pk/',
        privacy_url: 'https://api.goonj.pk/',
        public_ip_endpoint: 'https://ipinfo.io/json',
        video_limit: 15,
        ad_load_freq: 3,
        medium_banner_width: 300,
        medium_banner_height: 250,
        small_banner_width: 320,
        small_banner_height: 50,
        smaato_publisher_id: 1100038777,
        smaato_adspace_id: 130373139,
        inmobi_placement_id: '1520365051546L',
        admob_small_banner_id: 'ca-app-pub-8457136444921879~8502239343',
        admob_medium_banner_id: 'ca-app-pub-8457136444921879/9586214166',
        ads_priority: ['admob', 'smaato', 'inmobi'],
        // tabs = [{
        //     name: "name",
        //     icon: "icon"},
        //     {
        //     name: "name2",
        //     icon: "icon"}
        // ],
        bitrates: ['Auto', '144', '240', '360', '480', '720'],
        banner: 'newupdate.jpg',
        force_update: true,
        message: "Hello world!",
        update: true,
        latest_version: 1302
    }
    res.send(data);
}