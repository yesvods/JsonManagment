var GenerateSchema = require('generate-schema');
var info = require('./alert.js')
var _ = require('underscore');
var ls = localStorage;
module.exports = {
  createSchema: function(name, objStr){
    var schemaName = name + 'Schema';
    try {
      var obj = JSON.parse(objStr);
    }catch(e){
      info('JSON格式错误'+e);
      return false;
    }
    var schema = GenerateSchema.json(name, obj);
    if(ls[name]){
      info(name+'Schema已经存在');
      return false;
    }
    ls[name] = JSON.stringify({
      name: name,
      schema: schema,
      count: 0,
      data: []
    });
    return true;
  },
  getSchema: function(name){
    var objStr = ls[name];
    if(objStr=="undefined"){
      return ;
    }else{
      return JSON.parse(objStr).schema;
    }
  },
  add: function(name, data){
    var objStr = ls[name];
    if(objStr=="undefined"){
      return info('Schema '+name+' is not exist');
    }else{
      var obj = JSON.parse(objStr);
      var data = _.extend({
        _id : obj.count++
      }, data)
      obj.data.push(data);
      ls[name] = JSON.stringify(obj);
    }
  },
  get: function(name, pageNum, len){
    var objStr = ls[name];
    if(objStr=="undefined"){
      return info('Schema '+name+' is not exist');
    }else{
      var obj = JSON.parse(objStr);
      return obj.data.slice(pageNum*len, pageNum*(len+1));
    }
  },
  getAll: function(name){
    var objStr = ls[name];
    if(objStr=="undefined"){
      return info('Schema '+name+' is not exist');
    }else{
      var obj = JSON.parse(objStr);
      return obj.data;
    }
  },
  set: function(name, data){
    var objStr = ls[name];
    if(objStr=="undefined"){
      return info('Schema '+name+' is not exist');
    }else{
      var obj = JSON.parse(objStr);
      for(var i=0;i<obj.data.length;i++){
        var row = obj.data[i];
        if(row._id==data._id){
          obj.data[i]=data;
          break;
        }
      }
      ls[name] = JSON.stringify(obj);
    }
  },
  remove: function(name, index){
    var objStr = ls[name];
    if(objStr=="undefined"){
      return info('Schema '+name+' is not exist');
    }else{
      var obj = JSON.parse(objStr);
      for(var i=0;i<obj.data.length;i++){
        var row = obj.data[i];
        if(row._id==index){
          obj.data.splice(i, 1);
          break;
        }
      }
      ls[name] = JSON.stringify(obj);
    }
  }
}
