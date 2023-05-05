const express = require('express');

const path = require("path")

const app = express()


const startExpress = () => {
    app.use(
        "/css",
        express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
      )
      app.use(
        "/js",
        express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
      )
      app.use("/js", express.static(path.join(__dirname, "../node_modules/jquery/dist")))

      
      app.listen(8000, () => {
        console.log("Listening on port " + 8000)
      });

};


exports.startExpress = startExpress;