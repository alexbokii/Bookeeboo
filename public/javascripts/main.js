$(function() {
  // Slide effect iof unordered books section
  $(".booksnumber-keeper, .unordered-line").hide();

  $('.unordered-books button').on('click', function() {
    if ($('.unordered-wrapper').hasClass('slided-up')) {
      slideUnorderedListDown();
    }
    else {
      slideUnorderedListUp();
    }
  });

  function slideUnorderedListUp() {
    $('.unordered-wrapper').addClass('slided-up');
    $('.unordered-wrapper').slideUp();
    showNumberOfBookInUnordered();
  }

  function slideUnorderedListDown() {
    removeHtmlUnderSlider();
    $('.unordered-wrapper').removeClass('slided-up');
    $('.unordered-wrapper').slideDown();
  }

  function showNumberOfBookInUnordered() {
    var unorderedLength = $('.unordered-books li').length;
    $('.unordered-books').animate({'height':'55px'}, 300, function() {
      $('.booksnumber-keeper span').html(unorderedLength);
      $('.booksnumber-keeper, .unordered-line').show();
    });
  }

  function removeHtmlUnderSlider() {
    $('.unordered-books').css({'height':''});
    $(".booksnumber-keeper, .unordered-line").hide();
  }

});