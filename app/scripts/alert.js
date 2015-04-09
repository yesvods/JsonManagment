module.exports = function(content){
  $('#alert').text(content)
    .slideDown();
  setTimeout(function(){
    $('#alert').slideUp();
  },1500)
}
