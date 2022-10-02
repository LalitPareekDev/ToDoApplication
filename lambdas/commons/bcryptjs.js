const bcrypt = require('bcryptjs');

const encrypt = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

const hashValidate = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
}

module.exports = { encrypt, hashValidate }