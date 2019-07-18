const express = require('express');
const router = express.Router();

const videoService =    require('./services/video');
const channelService =  require('./services/channel');
const anchorService =   require('./services/anchor');
const programService =  require('./services/program');
const topicService =    require('./services/topic');
const userService =     require('./services/user');
const configService =   require('./services/config');
const searchService =   require('./services/search');
const adImpression =    require('./services/adImpression');

// Service Label
router.get('/', (req, res) => res.send("API Gateway"));

router.get('/video',    videoService.getVideo);
router.get('/live',     channelService.getChannel);
router.get('/anchor',   anchorService.getAnchor);
router.get('/program',  programService.getProgram);
router.get('/topic',    topicService.getTopic);
router.get('/config',   configService.settings);    // All configs are shifted to Firebase
router.get('/search',   searchService.getSearch);

// Paywall billing
router.post('/user/sendOtp',            userService.sendOtp);
router.get('/user/validateOtp',         userService.validateOtp);
router.post('/user/subscribe',          userService.subscribe);
router.get('/user/unsubscribe',         userService.unSubscribe);
router.get('/user/unsub',         userService.unSub);
router.get('/user/subscriptionStatus',  userService.subscriptionStatus);
router.get('/user/packages',  			userService.packages);

// AdImpressions
router.post('/vodAd',            adImpression.postVodAds);
router.post('/liveAd',           adImpression.postLiveAds);
// router.get('/', (req, res) => res.send("API Gateway"));

module.exports = router;