'use strict';

const express = require('express');
const indexController = require("./controllers/indexController");
const terminalController = require("./controllers/terminalController");
const router = express.Router();

router.get("/", indexController.renderHomePage);
router.post("/terminal", terminalController.getCommandResult);

module.exports = router;