'use strict';

const Command = require("../Command");
const cat = require("./catCommand").cat;

exports.cmd = function() {
    return new Command((args) => cat("./documents/help.html"));
}