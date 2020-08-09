'use strict';

const commandFactory = require("./Commands/commandFactory");

const Terminal = function() {
    this.commands = { };
    this.addOrChangeCommand("echo");
    this.addOrChangeCommand("ls");
    this.addOrChangeCommand("cat");
    this.addOrChangeCommand("help");
}

Terminal.prototype.addOrChangeCommand = function(cmdName) {
    this.commands[cmdName] = commandFactory.getCommand(cmdName);
}

Terminal.prototype.hasCommand = function(cmdName) {
    return this.commands[cmdName] !== undefined;
}

Terminal.prototype.executeInput = function(input) {
    if (input === undefined) {
        throw new ReferenceError("User input was undefined");
    }

    const args = input.split(" ").filter((elem) => elem !== null && elem.length > 0);
    const cmdName = args.shift();
    const strNoCmdName = input.substr(cmdName.length + 1);
    args.unshift(strNoCmdName);

    return this.executeCmdName(cmdName, args);
}

Terminal.prototype.executeCmdName = function(cmdName, args) {
    if (!this.hasCommand(cmdName)) {
        return `Unknown command '${cmdName}'<br><br>`;
    }

    return this.executeCmd(this.commands[cmdName], args);
}

Terminal.prototype.executeCmd = function(cmd, args) {
    if (cmd === undefined) {
        throw new ReferenceError(`The command is undefined`);
    }

    if (args === undefined) {
        throw new ReferenceError(`The arguments for the command is undefined`);
    }

    return cmd.execute(args);
}

module.exports = Terminal;