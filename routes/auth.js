const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const validateFields = require("../middlewares/validateFields");
const router = Router();


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