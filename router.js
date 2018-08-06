const express = require('express');
const router = express.Router();

const videoService =    require('./services/video');
const channelService =  require('./services/channel');
const anchorService =   require('./services/anchor');
const topicService =    require('./services/topic');
const userService =     require('./services/user');
const configService =   require('./services/config');

router.get('/video',    videoService.getVideo);
router.get('/live',     channelService.getChannel);
router.get('/anchor',   anchorService.getAnchor);
router.get('/topic',    topicService.getTopic);
router.get('/config',   configService.settings);

router.route('/user')
    .get(userService.getUser)
    .post(userService.postUser);

// TODO
router.get('/recommendation');

module.exports = router;