let { find, read, write } = require('promise-path')
let path = require('path')

var outputFile = './instructions/tile-instructions.json'
var tileTemplate = `{
  "asset": "images/tiles/{name}.png",
  "template": "/tile-template.html",
  "renderer": {
    "$ref": "/data/renderer/tile-renderer.json"
  },
  "data": {
    "$ref": "/data/tiles/{name}.json"
  }
}`
var htmlTemplate = `{
  "asset": "debug/tiles/{name}.html",
  "template": "/tile-template.html",
  "renderer": {
    "$ref": "/data/renderer/html-renderer.json"
  },
  "data": {
    "$ref": "/data/tiles/{name}.json"
  }
}`

const pp = (data) => JSON.stringify(data, null, 2)

function readAssets(files) {
  return files.map(readAsset)
}

function readAsset(filepath) {
  const assetId = path.basename(filepath).slice(0, -5)
  return read(filepath, 'utf8')
    .then(JSON.parse)
    .then((data) => {
      data.assetId = assetId
      return data
    })
}

function displayError(ex) {
  console.error('Error:', ex, ex.stack)
}

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
  .catch(displayError)

find('./data/tiles/*.json')
  .then(files => Promise.all(readAssets(files)))
  .then(files => write('./data/tile-data.json', pp(files), 'utf8'))
  .then(result => console.log(`Created ./data/tile-data.json`))
  .catch(displayError)

Promise.all([
  readAsset('./data/tile-data.json')
])
.then((assets) => {
  return write('./data/all-data.json', pp({
    tiles: assets[0]
  }), 'utf8')
})

function createInstruction(name, template) {
  let instruction = JSON.parse(template.replace(/{name}/g, name))
  instructions.push(instruction)
}
