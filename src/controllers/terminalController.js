'use strict';

const Terminal = require("../models/Terminal");
const terminal = new Terminal();

exports.getCommandResult = (req, res) => {
    const result = terminal.executeInput(req.body.cmd);
    res.send(JSON.stringify(result));
}