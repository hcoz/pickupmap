const _cache = {};

module.exports = {
    set: (key, val) => {
        _cache[key] = val;
    },

    get: (key) => {
        return _cache[key];
    },

    del: (key) => {
        delete _cache[key];
    }
};
