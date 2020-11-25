const express = require('express');
const router = express.Router();

const videoService =    require('./services/video');
const channelService =  require('./services/channel');
const categoryService =  require('./services/category');
const anchorService =   require('./services/anchor');
const programService =  require('./services/program');
const topicService =    require('./services/topic');
const userService =     require('./services/user');
const configService =   require('./services/config');
const searchService =   require('./services/search');
const adImpression =    require('./services/ad_impression');
const paywall =    require('./services/paywall');

// Service Label
router.get('/', (req, res) => res.send("API Gateway"));

router.get('/video',    videoService.getVideo);
router.post('/video/views',    videoService.postVideoViews);

router.get('/live',     channelService.getChannel);
router.get('/category',     categoryService.getCategory);
router.get('/subcategory',     categoryService.getSubCategory);

router.post('/live/views',     channelService.postChannelViews);

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


// Paywall version 2
router.post('/payment/otp/send',            paywall.sendOtp);
router.post('/payment/otp/verify',            paywall.verifyOtp);
router.post('/payment/subscribe',            paywall.subcribe);
router.post('/payment/recharge',            paywall.recharge);
router.post('/payment/status',            paywall.status);
router.post('/auth/refresh',            paywall.refresh);
router.post('/payment/unsubscribe',            paywall.unsubscribe);
router.post('/payment/ccd-unsubscribe',            paywall.ccd_unsubscribe);
router.put('/user',            paywall.update_user);
router.post('/user/mark-black-listed',            paywall.mark_black_listed);
router.get('/user',            paywall.get_user);



//CCD
router.post('/ccd/login', paywall.login);
router.post('/ccd/unsub', paywall.ccd_unsub);
router.get('/ccd/details', paywall.details);
router.get('/ccd/getAllSubs', paywall.getAllSubs);

router.get('/package',            paywall.getPackages);
//router.get('/package/:id',            paywall.unsubscribe);
router.post('/user/update_package',            paywall.update_package);
router.get('/user/graylist/:msisdn',            paywall.isGrayListed);
router.get('/pageview',            paywall.pageView);
router.get('/paywall', paywall.paywall);

// Feedback Service
router.get('/questions', paywall.getQuestion)
router.post('/answer', paywall.answer)


// Paywall v2 Reports
router.get('/reports/rev',            paywall.revenue);
router.get('/reports/req-count',            paywall.req_count);
router.get('/reports/billing/stats',            paywall.billing_stats);
// router.get('/reports/revenue/stats',            paywall.revenue_stats);

// AdImpressions
router.post('/vodAd',            adImpression.postVodAds);
router.get('/vodAd',           adImpression.getVodAds);
router.post('/liveAd',           adImpression.postLiveAds);
router.get('/liveAd',           adImpression.getLiveAds);

module.exports = router;