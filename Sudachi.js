(function(global, document) {
  "use strict";  return document.addEventListner("DOMNodeInserted", function(event) {
    var icon, line;

    line = event.target;
    icon = document.createElement("img");
    icon.src = "http://coffeescript.org/documentation/images/logo.png";
    line.appendChild(icon);
    return this;
  }, false);
})(this, this.document);
