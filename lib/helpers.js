"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObject = void 0;
var parseObject = function (obj, searchFor, replaceWith) {
    var result = {};
    var regex = new RegExp(searchFor, 'g');
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'object') {
            parseObject(obj[key], searchFor, replaceWith);
        }
        else if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(regex, replaceWith);
        }
        result[key] = obj[key];
    });
    return result;
};
exports.parseObject = parseObject;
