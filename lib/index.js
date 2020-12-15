#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var replaceJsonValues = require('./helpers').replaceJsonValues;
var defaultConfig = require('./default.config.js');
var config = defaultConfig;
try {
    var userConfig = require(process.cwd() + "/pinecone.config");
    config = __assign(__assign({}, defaultConfig), userConfig);
}
catch (err) {
    console.warn(err);
}
var themeFile = fs.readFileSync(config.input);
config.themes.map(function (variant) {
    var newTheme = null;
    var theme = JSON.parse(themeFile);
    Object.keys(variant.colors).forEach(function (key, index) {
        var pattern = "" + config.prefix + key; // _pine
        if (!newTheme) {
            newTheme = replaceJsonValues(theme, pattern, variant.colors[key]);
        }
        else {
            newTheme = replaceJsonValues(newTheme, pattern, variant.colors[key]);
        }
    });
    newTheme.name = variant.name;
    newTheme.type = variant.type;
    fs.writeFileSync(config.dir + "/" + variant.slug + "-color-theme.json", JSON.stringify(newTheme));
});
