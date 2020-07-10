"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceJsonValues = void 0;
exports.replaceJsonValues = function (obj, searchFor, replaceWith) {
    var result = {};
    var regex = new RegExp("\"" + searchFor + "\"", 'g');
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'object') {
            exports.replaceJsonValues(obj[key], searchFor, replaceWith);
        }
        else if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(regex, replaceWith);
        }
        result[key] = obj[key];
    });
    return result;
};
