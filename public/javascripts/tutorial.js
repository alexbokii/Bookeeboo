(function() {
  var tutorial = bookeeboo.tutorial = {
    start: function() {
      $('body').append("<div class='tutorial-background full-cover'></div>");
      $('body, html').addClass('fixed-height');
      $('.welcome').show();

      $('.welcome').on('click', 'button.start', showCurrentBookTutorial);

      $('.readingNow').on('click', 'button', showUnorderedBooksTutorial);

      $('.unorderedBooks').on('click', 'button', showOrderedBooksTutorial);

      $('.orderedBooks').on('click', 'button', function() {
        finishTutorial();
      });
    }
  };

  function showNextStep(previousSection, currentSection) {
    previousSection.hide();
    currentSection.show();
  }

  function addDarkerBackgrountAroundCurrentSection(previousEl, nextEl) {
    $('body').find('.tutorial-background').remove();
    if(previousEl) {
      previousEl.append("<div class='tutorial-background full-cover'></div>");
    }
    if(nextEl) {
      nextEl.append("<div class='tutorial-background full-cover'></div>");
    }
  }

  function showCurrentBookTutorial() {
    showNextStep($('.welcome'), $('.readingNow'));
    addDarkerBackgrountAroundCurrentSection(undefined, $('.unordered-books'));
    $('body, html').removeClass('fixed-height');
  }

  function showUnorderedBooksTutorial() {
    showNextStep($('.readingNow'), $('.unorderedBooks'));
    addDarkerBackgrountAroundCurrentSection($('.panel'), $('.ordered-books'));
    $('html, body').animate({
      scrollTop: $('.slider').offset().top
    }, 500);
  }

  function showOrderedBooksTutorial() {
    showNextStep($('.unorderedBooks'), $('.orderedBooks'));
    addDarkerBackgrountAroundCurrentSection($('.panel, .unordered-books'));
    $('html, body').animate({
      scrollTop: $('.unordered-books').offset().top
    }, 500);
  }

  function finishTutorial() {
    $('body').find('.tutorial-background').remove();
    $('.orderedBooks').hide();
  }

  
})();
