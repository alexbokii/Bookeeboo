$(function() {
  // Slide effect iof unordered books section
  $(".booksnumber-keeper, .unordered-line").hide();

  $('.unordered-books button:not(.second)').on('click', function() {
    if ($('.unordered-wrapper').hasClass('slided-up')) {
      removeHtmlUnderSlider();
      slideUnorderedListDown();
    }
    else {
      slideUnorderedListUp();
      showNumberOfBookInUnordered();
    }
  });

  function slideUnorderedListUp() {
    $('.unordered-wrapper').addClass('slided-up');
    $('.unordered-wrapper').slideUp();
  }

  function slideUnorderedListDown() {
    $('.unordered-wrapper').removeClass('slided-up');
    $('.unordered-wrapper').slideDown();
  }

  function showNumberOfBookInUnordered() {
    $('.unordered-books').animate({'height':'55px'}, 300, function() {
      $('.booksnumber-keeper, .unordered-line').show();
    });
  }

  function removeHtmlUnderSlider() {
    $('.unordered-books').css({'height':''});
    $(".booksnumber-keeper, .unordered-line").hide();
  }

});
