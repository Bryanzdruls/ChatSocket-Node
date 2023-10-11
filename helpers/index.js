const dbValidators =require('./db-validators.js')
const googleVerify =require('./google-verify.js')
const generateJWT =require('./generate-jwt.js')
const uploadFile =require('./upload-file.js')

module.exports = {
    ...dbValidators,
    ...googleVerify,
    ...generateJWT,
    ...uploadFile
}