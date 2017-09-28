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

const pp = (data) => JSON.stringify(data, null, 2)

var instructions = []
find('./data/tiles/*.json')
  .then(files => files.map(filepath => path.basename(filepath)))
  .then(files => files.map(filename => filename.slice(0, -5)))
  .then(files => files.map(file => {
    createInstruction(file, tileTemplate)
    createInstruction(file, htmlTemplate)
    return file
  }))
  .then(files => write('./data/tile-assets.json', pp(files), 'utf8'))
  .then(() => write(outputFile, pp(instructions), 'utf8'))
  .then(result => console.log(`Created ${outputFile}`))

function createInstruction(name, template) {
  let instruction = JSON.parse(template.replace(/{name}/g, name))
  instructions.push(instruction)
}
