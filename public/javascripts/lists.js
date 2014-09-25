$(document).ready(function() {
  // var currentSearch;

  //1. Prepare DOM
  
  

  //2. Height of h5 in ordered list
  // Every li has own extra height for title. Count this height and the height of title here.
  function setHeight() {
    $(".ordered-books li").each(function() {
      var h5 = $(this).find("h5")[0];
      var img = $(this).find("img")[0];

      var h5Height = $(h5).height();
      var imgHeight = $(img).height();

      var result = 250 - imgHeight - 24 - 20;
      $(h5).height(result);
    });
  } 

  // Search
  



});