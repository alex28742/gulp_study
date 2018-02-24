$(function(){
  //$('body').fadeOut();
  setTimeout(function(){
    var divs = $('div').css('background', 'lightyellow');
    var i = 0;
    divs.each(function(){

      $(this).text('div '+(++i)+'');
    });
  }, 2000);
});
