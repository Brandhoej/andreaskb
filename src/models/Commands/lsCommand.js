'use strict';

const Command = require("../Command");
const fs = require("fs");

function ls(args) {
    let result = "";
    let files = fs.readdirSync('./documents/');
    for (let file of files) {
        result += file + "\u00a0\u00a0\u00a0";
    }
    return result + "<br><br>";
}

exports.cmd = function() {
    return new Command(ls);
}