'use strict';

const Command = require("../Command");

function echo(args) {
    if(args.length === 0) {
        throw new ReferenceError("Echo did not have at least 1. This one should be constructed by the terminal by default and should consist of the whole user input without the command name");
    }

    return args[0];
}

exports.cmd = function() {
    return new Command(echo);
}