'use strict';

const echoCommand = require("./echoCommand").cmd;
const lsCommand = require("./lsCommand").cmd;
const catCommand = require("./catCommand").cmd;
const helpCommand = require("./helpCommand").cmd;

exports.getCommand = function(cmdName) {
    switch (cmdName) {
        case "echo": return echoCommand();
        case "ls":   return lsCommand();
        case "cat":  return catCommand();
        case "help": return helpCommand();
        default: throw new Error(`Command factory was asked to construct command which is not supported ${cmdName}`)
    }
}