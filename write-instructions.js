let { find, read, write } = require('promise-path')
let path = require('path')

var printableTileTemplate = `{
  "asset": "images/tiles/printable-{name}.png",
  "template": "/printable-tile-template.html",
  "renderer": {
    "$ref": "/data/renderer/printable-tile-renderer.json"
  },
  "data": {
    "assetId": "{name}",
    "tile": {
      "$ref": "/data/tiles/{name}.json"
    }
  }
}`
var presentationTileTemplate = `{
  "asset": "images/tiles/{name}.png",
  "template": "/presentation-tile-template.html",
  "renderer": {
    "$ref": "/data/renderer/presentation-tile-renderer.json"
  },
  "data": {
    "sourceAsset": "/output/images/tiles/printable-{name}.png",
    "tile": {
      "$ref": "/data/tiles/{name}.json"
    }
  }
}`

function createInstruction(name, template, instructions) {
  let instruction = JSON.parse(template.replace(/{name}/g, name))
  instructions.push(instruction)
}

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

function writePrintableTileInstructions() {
  var instructions = []
  var outputFile = './instructions/01-printable-tile-instructions.json'
  return find('./data/tiles/*.json')
    .then(files => files.map(filepath => path.basename(filepath)))
    .then(files => files.map(filename => filename.slice(0, -5)))
    .then(files => files.map(file => {
      createInstruction(file, printableTileTemplate, instructions)
      return file
    }))
    .then(files => write('./data/tile-assets.json', pp(files), 'utf8'))
    .then(() => write(outputFile, pp(instructions), 'utf8'))
    .then(result => console.log(`Created ${outputFile}`))
    .catch(displayError)
}

function writePresentationTileInstructions() {
  var instructions = []
  var outputFile = './instructions/02-presentation-tile-instructions.json'
  return find('./data/tiles/*.json')
    .then(files => files.map(filepath => path.basename(filepath)))
    .then(files => files.map(filename => filename.slice(0, -5)))
    .then(files => files.map(file => {
      createInstruction(file, presentationTileTemplate, instructions)
      return file
    }))
    .then(files => write('./data/tile-assets.json', pp(files), 'utf8'))
    .then(() => write(outputFile, pp(instructions), 'utf8'))
    .then(result => console.log(`Created ${outputFile}`))
    .catch(displayError)
}

function writeTileData() {
  const outputFile = './data/tile-data.json'
  return find('./data/tiles/*.json')
    .then(files => Promise.all(readAssets(files)))
    .then(files => write(outputFile, pp(files), 'utf8'))
    .then(result => console.log(`Created ${outputFile}`))
    .catch(displayError)
}

function writeAllData() {
  const outputFile = './data/all-data.json'
  Promise.all([
    readAsset('./data/tile-data.json')
  ])
  .then((assets) => {
    return write(outputFile, pp({
      tiles: assets[0]
    }), 'utf8')
      .then(result => console.log(`Created ${outputFile}`))
  })
}

function howManyTiles() {
  return read('./data/tile-data.json')
    .then(JSON.parse)
    .then(data => {
      const numberOfTiles = data.reduce((result, tile) => {
        return result + tile.quantity
      }, 0)
      console.log(`Expecting ${numberOfTiles} tiles total.`)
    })
}

Promise.all([
  writeTileData(),
  writePrintableTileInstructions(),
  writePresentationTileInstructions(),
  writeAllData()
])
.then(howManyTiles)
