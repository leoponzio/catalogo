

const helpers = {};

helpers.isMaster = (arg1, arg2, options) => {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
 
}

module.exports = helpers;