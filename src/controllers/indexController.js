'use strict';

exports.renderHomePage = (req, res) => {
    res.render("index", {
        directory: "C:\\Users\\Andreas",
        directoryPointer: ">"
    });
}