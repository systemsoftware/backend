const { Router } = require('express');
const firebase = require('../firebase-admin');
const logs = require('../logs');

const router = Router();

  router.get('/me', async (req, res) => {
    try{
    const { token } = req.cookies;

    if (!token) {
        return logs.APIResponseError({ msg: 'No token provided', code: 401, res });
    }

    const user = await firebase.auth().verifyIdToken(token);

    logs.APIResponse({ msg: 'Success', data: user, res });
  }catch (e) {
    logs.APIResponseError({ msg: e.message, code: 500, res });
    logs.error(e);
  }
  })

module.exports = router;