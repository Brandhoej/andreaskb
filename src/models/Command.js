'use strict';

const Command = function(func) {
    if (func == undefined) {
        throw new Error(`The func passed in the constructor of a command '${JSON.stringify(this)}' must not be undefined`);
    }

    this.func = func;
}

Command.prototype.execute = function(args) {
    if (args == undefined) {
        throw new Error(`The arguments for the command '${JSON.stringify(this)}' is undefined`);
    }

    return this.func(args);
}

module.exports = Command;