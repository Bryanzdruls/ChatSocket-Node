const {Schema,model} = require('mongoose')

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'Role is a must']
    }
});

module.exports = model('Role', RoleSchema);