const { Router } = require('express');
const getContrastColor = require('../contrast');
const { APIResponse, APIResponseError} = require('../logs');

const router = Router();

router.get('/*', (req, res) => {

    if(!req.query.color) return APIResponseError({ code:400, msg:"Color query parameter is required", res });

    APIResponse({ code:200, msg:"Success", data: getContrastColor(req.query.color), res });

})

module.exports = router;