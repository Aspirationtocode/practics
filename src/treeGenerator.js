const dirTree = require('directory-tree');
const prettyJSONStringify = require('pretty-json-stringify');
const fs = require('fs');

const tree = dirTree('src/static/data/Документы');

const JSONTree = prettyJSONStringify(tree)

fs.writeFile("src/JSONTree.json", JSONTree, function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");
}); 