var GenerateSchema = require('generate-schema');
var info = require('./alert.js');
var lsdb = require('./lsDB.js');
var ls = localStorage;

// Capture Schema Output
// var schema = GenerateSchema.json('Product', [
//     {
//         "id": 2,
//         "name": "An ice sculpture",
//         "price": 12.50,
//         "tags": ["cold", "ice"],
//         "dimensions": {
//             "length": 7.0,
//             "width": 12.0,
//             "height": 9.5
//         },
//         "warehouseLocation": {
//             "latitude": -78.75,
//             "longitude": 20.4
//         }
//     },
//     {
//         "id": 3,
//         "name": "A blue mouse",
//         "price": 25.50,
//         "dimensions": {
//             "length": 3.1,
//             "width": 1.0,
//             "height": 1.0
//         },
//         "warehouseLocation": {
//             "latitude": 54.4,
//             "longitude": -32.7
//         }
//     }
// ]);

// var element = document.querySelector('#jsoneditor');
// var editor = new JSONEditor(element, {
//   theme: 'bootstrap3',
//   schema: schema
// });
var selectedSchemaName = "";
var editor;

//渲染逻辑
var schemasList ;
function renderMenu(){
  var schemaTpl = Handlebars.compile($('#list-schema').html());
  schemasList = [];
  for(var i in ls){
    var schema = lsdb.getSchema(i);
    if(schema){
      schemasList.push(i);
    }
  }
  var html = schemaTpl({schemaList: schemasList})
  $('.schema-item').remove();
  $('.list-group-item.disabled').after($(html));
}
renderMenu();
$('#schemaAddBtn').click(function(){
  $('#addSchemaModal').modal('show');
})
$('#addSchemaModal .modal-footer:last-child').click(function(){
  var name = $('#addSchemaModal .modal-body [name="title"]').val();
  var jsonStr = $('#addSchemaModal .modal-body textarea').val();
  if(jsonStr.trim()=='' || jsonStr.trim()==''){
    info('不能为空');
    return;
  }
  var flag = lsdb.createSchema(name, jsonStr);
  if(flag) {
    info('创建成功');
    $('#addSchemaModal').modal('hide');
    renderMenu();
  }
})

$('.list-group').click(function(e){
  var $target = $(e.target);
  if($target.hasClass('glyphicon') && confirm('删除Schema?')){
    var schemaName = $target.closest('.schema-item').text().trim()
    delete ls[schemaName];
    info('删除 '+schemaName+' 成功');
    renderMenu();
    return;
  }
  if($target.hasClass('schema-item')){
    var schemaName = $target.text().trim();
    console.log(schemaName)
    selectedSchemaName = schemaName;
    renderContent(schemaName);
    $('#btnAddJson').show();
  }
})
Handlebars.registerHelper('contentRow', function(obj){
  var resultStr = "";
  resultStr+="<td>"+obj._id+"</td>";
  for(var i in obj){
    if(i=="_id") continue;
    resultStr+="<td>"+obj[i]+"</td>";
  }
  return new Handlebars.SafeString(resultStr);
});
function renderContent(schemaName){
  //渲染data
  var dataTpl = Handlebars.compile($('#list-data').html());

  var selectedSchema = schemasList[0];

  var attrs = Object.keys(lsdb.getSchema(schemaName).properties);
  var datas = lsdb.getAll(schemaName);
  var dataHtml = dataTpl({
    datas: datas,
    attrs: attrs
  });
  $('.table.table-bordered').html(dataHtml);
}
function renderEditor(schemaName, data){
  var element = document.querySelector('#jsonEditor');
  $('#jsonEditor').html('')
  $('#jsonEditorModal').modal('show');
  editor = new JSONEditor(element, {
    theme: 'bootstrap3',
    schema: lsdb.getSchema(schemaName)
  });
  editor.setValue(data);
  return editor;
}
$('.table.table-bordered').click(function(e){
  var $target = $(e.target);
  if($target.hasClass('glyphicon-pencil')){
    var id = $target.closest('tr').data('id');
    var datas = lsdb.getAll(selectedSchemaName);
    for(var i=0;i<datas.length;i++){
      if(datas[i]._id==id){
        renderEditor(selectedSchemaName, datas[i]);
        return;
      }
    }
  }
  if($target.hasClass('glyphicon-remove')){
    var id = $target.closest('tr').data('id');
    lsdb.remove(selectedSchemaName, id);
    info('删除成功');
    //重新渲染
    renderContent(selectedSchemaName);
  }
})
$('#jsonEditorModal .btn.btn-primary').click(function(e){
  var value = editor.getValue();
  if(value._id){
    lsdb.set(selectedSchemaName, value);

    info('保存成功');
  }else{
    lsdb.add(selectedSchemaName, value);
    info('添加成功');
  }
  $('#jsonEditorModal').modal('hide');
  //重新渲染
  renderContent(selectedSchemaName);
})
//添加JSON
$('#btnAddJson').click(function(e){
  renderEditor(selectedSchemaName, {});

})
