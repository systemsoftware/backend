const { Router } = require('express');
const { info, error, success, APIError } = require('../logs');

const router = Router();

router.get('/demo', (req, res) => {

    res.send('Hello, World.');

})

module.exports = router;