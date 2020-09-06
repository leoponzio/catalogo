

const helpers = {};

helpers.isMaster = (arg1, arg2, options) => {
        console.log(arg1);
        console.log(arg2);
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
 
}

module.exports = helpers;