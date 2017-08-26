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
var htmlTemplate = `{
  "asset": "{name}.html",
  "template": "/tile-renderer.html",
  "renderer": {
    "$ref": "/data/renderer/html-renderer.json"
  },
  "data": {
    "$ref": "/data/tiles/{name}.json"
  }
}`

var instructions = []
find('./data/tiles/*.json')
  .then(files => files.map(filepath => path.basename(filepath)))
  .then(files => files.map(filename => filename.slice(0, -5)))
  .then(files => files.forEach((file) => {
    createInstruction(file, tileTemplate)
    createInstruction(file, htmlTemplate)
  }))
  .then(() => write(outputFile, JSON.stringify(instructions, null, 2), 'utf8'))
  .then(result => console.log(`Created ${outputFile}`))

function createInstruction(name, template) {
  let instruction = JSON.parse(template.replace(/{name}/g, name))
  instructions.push(instruction)
}
