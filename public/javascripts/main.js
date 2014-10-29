$(function() {
  // Slide effect iof unordered books section
  $('.hidden-pageKeeper').hide();

  $('.unordered-books button:not(.second)').on('click', function() {
    if ($('.unordered-wrapper').hasClass('slided-up')) {
      removeHtmlUnderSlider();
      slideUnorderedListDown();
    }
    else {
      slideUnorderedListUp();
      setTimeout(function() {
        showNumberOfBookInUnordered();
      }, 500);
    }
  });

  function slideUnorderedListUp() {
    $('.unordered-wrapper').addClass('slided-up');
    setTimeout(function() {
      $('button.up').css('background-image', 'url(../images/icon-unordered-up.png)');
      $('button.bottom').css('background-image', 'url(../images/icon-unordered-bottom.png)');
    }, 500);
    $('.unordered-wrapper').slideUp();
  }

  function slideUnorderedListDown() {
    $('.unordered-wrapper').removeClass('slided-up');
    $('button.bottom').css('background-image', 'url(../images/icon-unordered-up.png)');
    $('button.up').css('background-image', 'url(../images/icon-unordered-bottom.png)');
    $('.unordered-wrapper').slideDown();
  }

  function showNumberOfBookInUnordered() {
    $('.hidden-pageKeeper').show("slow");
  }

  function removeHtmlUnderSlider() {
    $('.hidden-pageKeeper').hide();
  }
});