const router = require('express').Router();

const { createShortUrl } = require('../controller/createController');
const { getUrl } = require('../controller/GetUrlController');

router.post('/url/shorten', createShortUrl);

router.get('/:urlCode', getUrl);

module.exports = router;