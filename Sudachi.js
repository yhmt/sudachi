(function(global, document) {
  var addClass, hasClass, imgBase, removeClass;

  imgBase = "emojis/";
  hasClass = function(el, name) {
    return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
  };
  addClass = function(el, name) {
    if (!hasClass(el, name)) {
      el.className += (el.className ? " " : "") + name;
    }
  };
  removeClass = function(el, name) {
    if (hasClass(el, name)) {
      el.className = el.className.replace(new RegExp("(\\s|^)" + name + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, "");
    }
  };
  return document.addEventListener("DOMNodeInserted", function(event) {
    var avatar, emoji, isFirst, line, matchName, message, nick, sender, senderType, type;

    line = event.target;
    type = line.getAttribute("type");
    nick = line.getAttribute("nick");
    avatar = document.createElement("div");
    emoji = document.createElement("img");
    switch (type) {
      case "privmsg":
        sender = line.getElementsByClassName("sender")[0];
        isFirst = sender.getAttribute("first") === "true" ? true : false;
        message = line.getElementsByClassName("message")[0];
        matchName = message.innerHTML.match(/:([\d\w+-_]+):/);
        senderType = sender.getAttribute("type");
        if (isFirst) {
          addClass(line, "first");
          sender.setAttribute("data-name", "橋本 雄也");
          avatar.className = "avatar";
          avatar.style.backgroundImage = "url(avatar/" + nick + ".png)";
          line.insertBefore(avatar, sender);
        }
        if (senderType === "myself") {
          addClass(line, "myself");
        }
        emoji.className = "emoji";
        emoji.src = "" + imgBase + matchName[1] + ".png";
        line.appendChild(emoji);
        return message.innerHTML = message.innerHTML.replace(/:[\d\w+-_]+:/g, "");
    }
  }, false);
})(this, this.document);
