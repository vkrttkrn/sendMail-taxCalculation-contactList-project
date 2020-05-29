const path = require("path");
const fs = require("fs");
const _ = require("lodash");

//read file in current directory file pers file.
fs.readdirSync(__dirname).forEach((file) => {
  // If file is index.js read next file.
  if (file === "index.js") return;

  //Create empty object.
  let mod = {};

  //assign module to mod object
  mod[path.basename(file, ".js")] = require(path.join(__dirname, file));

  //copy source value to destination
  _.extend(module.exports, mod);
});
