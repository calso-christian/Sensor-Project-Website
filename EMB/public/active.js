const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a').forEach(link =>{
    if(link.href.includes(`${activePage}`)){
        link.classList.add('current');
    }
})


jQuery(document).ready(function($) {
    var alterClass = function() {
      var ww = document.body.clientWidth;
      if (ww < 749) {
        $('.first').addClass('order-1');
        $('.greettarget').addClass('order-2');
      } else if (ww >= 749) {
        $('.first').removeClass('order-1');
        $('.greettarget').removeClass('order-2');
      };
    };
    $(window).resize(function(){
      alterClass();
    });
    //Fire it when the page first loads:
    alterClass();
  });