const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn, renewToken } = require("../controllers/auth");
const {validateFields,validateJWT} = require("../middlewares/");
const router = Router();

router.get('/',[
    validateJWT
],renewToken)
router.post('/login',[
    check('email', 'Email is a must').isEmail(),
    check('password', 'password is a must').not().isEmpty().isLength({ min:6 }),
    validateFields,
], login);

router.post('/google',[
    check('id_token', 'id_token is a must').not().isEmpty(),
    
    validateFields,
], googleSignIn);
module.exports = router;