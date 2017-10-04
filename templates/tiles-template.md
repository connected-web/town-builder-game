# {{projectName}} Tiles

{{#each model.tiles}}
## {{this.code}} : {{this.title}}
![{{this.title}}]({{this.assetId}}.png)

{{this.description}}
{{/each}}
