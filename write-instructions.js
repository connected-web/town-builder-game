let { find, write } = require('promise-path')
let path = require('path')

var outputFile = './instructions/tile-instructions.json'
var tileTemplate = `{
  "asset": "{name}.png",
  "template": "/tile-renderer.html",
  "renderer": {
    "$ref": "/data/renderer/tile-renderer.json"
  },
  "data": {
    "$ref": "/data/tiles/{name}.json"
  }
}`

var instructions = []
find('./data/tiles/*.json')
  .then(files => files.map(filepath => path.basename(filepath)))
  .then(files => files.map(filename => filename.slice(0, -5)))
  .then(files => files.map(createInstruction))
  .then(instructions => write(outputFile, JSON.stringify(instructions, null, 2), 'utf8'))
  .then(result => console.log(`Created ${outputFile}`))

function createInstruction(name) {
  return JSON.parse(tileTemplate.replace(/{name}/g, name))
}
