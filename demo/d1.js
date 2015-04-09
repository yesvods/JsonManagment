var GenerateSchema = require('generate-schema');
var schema = GenerateSchema.json('Persion', [{
  name: '小明',
  age: 2123,
  region: 'westorn'
}])
console.log(JSON.stringify(schema))
