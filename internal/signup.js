const { Router } = require('express');
const firebase = require('firebase-admin');

const router = Router();

router.post('/signup', async (req, res) => {

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,32}$/;
  if (!passwordRegex.test(req.body.pass)) {
    return res.send({ error:"Invalid password. Must match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,32}$/" })
  }
  
  
  try{
  const user = await firebase.auth().createUser({
      email: req.body.email,
      password: req.body.pass,
      displayName: req.body.name,
      photoURL:`https://raw.githubusercontent.com/PartySocial/images/main/partysocial.png`
  })

  res.status(201).send({ success: true, user: user.toJSON() })
  }
  catch(e){
      res.status(400).send({ error: e.message })
  }
  })

module.exports = router;