'use strict';

const Command = require("../Command");
const fs = require("fs");

exports.cat = function(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK | fs.constants.R_OK);
        return fs.readFileSync(path).toString();
    } catch (error) {
        return `No such file '${path}'<br><br>`;
    }
}

exports.cmd = function() {
    return new Command((args) => exports.cat('./documents/' + args[0]));
}