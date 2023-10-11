const { Router } = require("express");
const { check } = require("express-validator");

const validateFields = require("../middlewares/validateFields");
const { loadFile, updateFile, updateImage, showImages, updateImageCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const router = Router();

router.post('/',loadFile);

router.put('/:collection/:id',[
    check('id', 'Has to be Mongo Id').isMongoId(),
    check('collection').custom(c => allowedCollections(c,['users','products'])),
    validateFields
],updateImageCloudinary);

router.get('/:collection/:id',[
    check('id', 'Has to be Mongo Id').isMongoId(),
    check('collection').custom(c => allowedCollections(c,['users','products'])),
    validateFields
],showImages)
module.exports = router;