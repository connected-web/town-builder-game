# {{projectName}}

## Tiles
{{#each model.tiles}}
### {{this.code}} : {{this.title}} - Quantity: {{this.quantity}}

![{{this.title}}](./images/tiles/{{this.assetId}}.png)

{{this.description}}
{{/each}}
