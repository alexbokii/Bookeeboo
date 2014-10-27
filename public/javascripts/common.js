var common = bookeeboo.common = {
  buildBookHtml: function(array) {
    var htmlList = [];
    for (var i = 0; i < array.length; i++) {
      var htmlListItem = ("<li>"
        + "<input type='hidden' value='" + array[i].id + "' />"
        + "<img src='" + array[i].imageUrl + "'/>"
        + "<h5>" + array[i].title + "</h5>"
        + "<div class='index'>" + (i + 1) + "</div>"
        + "</li>");
      htmlList.push(htmlListItem);
    } // end of for
    return htmlList;
  }
}