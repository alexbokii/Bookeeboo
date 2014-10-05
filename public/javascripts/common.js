var common = bookeeboo.common = {
  currentBook: {},
  buildBookHtml: function(array) {
    var index = 0;
    var htlmList = [];
    for (var i = 0; i < array.length; i++) {
      var htmlListItem = ("<li>"
        + "<input type='hidden' value='" + array[i].id + "' />"
        + "<img src='" + array[i].imageUrl + "'/>"
        + "<h5>" + array[i].title + "</h5>"
        + "<div class='index'>" + (index+1) + "</div>"
        + "</li>");
      htlmList.push(htmlListItem);
      index++;
    } // end of for
    return htlmList;
  }
}