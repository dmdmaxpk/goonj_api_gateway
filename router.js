const express = require('express');
const router = express.Router();

const videoService =    require('./services/video');
const channelService =  require('./services/channel');
const anchorService =   require('./services/anchor');
const topicService =    require('./services/topic');
const userService =     require('./services/user');
const configService =   require('./services/config');
const searchService =   require('./services/search');

// Service Label
router.get('/', (req, res) => res.send("API Gateway"));

router.get('/video',    videoService.getVideo);
router.get('/live',     channelService.getChannel);
router.get('/anchor',   anchorService.getAnchor);
router.get('/topic',    topicService.getTopic);
router.get('/config',   configService.settings);    // All configs are shifted to Firebase
router.get('/search',   searchService.getSearch);

// Paywall billing
router.post('/user/sendOtp',            userService.sendOtp);
router.get('/user/validateOtp',         userService.validateOtp);
router.post('/user/subscribe',          userService.subscribe);
router.get('/user/subscriptionStatus',  userService.subscriptionStatus);

// TODO
router.get('/recommendation');

module.exports = router;