const express = require("express");
const sm = require("./source-map");
const path = require("path");
const { formatMappings } = require("./utils");
const decodeComponent = require("./src/decodeComponent");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  //   res.setHeader("Content-Type", "application/json");
  //   const mapResult = formatMappings(sm.mappings, sm.sources, sm.names);
  //   res.send(JSON.stringify({ success: mapResult }));
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/api/:payload", (req, res) => {
  console.log(req.params.payload);
  res.setHeader("Content-Type", "application/json");

  const payload = JSON.parse(req.params.payload);
  console.log(payload);
  decodeComponent(payload)
    .then((result) => {
      res.send(JSON.stringify({ success: true, result }));
    })
    .catch((error) => {
      res.send(JSON.stringify({ success: false, error }));
    });
});
app.listen(process.env.PORT || 5000, function () {
  console.log("Server running @ 5000");
});
