const express = require("express");
const port = 1000;
const myServer = express ();

myServer.get("/",(request, response) => {
    response.send("Hello tanaihan manaihan nemsen tegvel garch irhel yostoidooo!");
});

myServer.listen (port, () => {
    console.log("Bat's server running!");
});
