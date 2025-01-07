const { Router } = require('express');

const router = Router();

router.get('/*', (req, res) => {

    res.send('Hello API World!');

})

module.exports = router;