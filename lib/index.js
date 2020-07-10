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
var theme = JSON.parse(themeFile);
config.themes.map(function (variant) {
    var colors = variant.colors, name = variant.name, slug = variant.slug, type = variant.type;
    var newTheme = { name: name, type: type };
    Object.keys(colors).forEach(function (key, index) {
        var pattern = "" + config.prefix + key;
        if (index == 0) {
            newTheme = replaceJsonValues(theme, pattern, colors[key]);
        }
        else {
            newTheme = replaceJsonValues(newTheme, pattern, colors[key]);
        }
    });
    newTheme.name = name;
    newTheme.type = type;
    fs.writeFileSync(config.dir + "/" + slug + "-color-theme.json", JSON.stringify(newTheme));
});
