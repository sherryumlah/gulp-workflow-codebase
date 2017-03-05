$(function() {
  var Mustache = require('mustache');

  $.getJSON('js/data.json', function(data) {
    var template = $('#exampletpl').html();
    var html = Mustache.to_html(template, data);
    $('#example').html(html);
  }); //getJSON

}); //function
