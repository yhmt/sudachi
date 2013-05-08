Element.prototype.hasClass = function(klassName) {
  return new RegExp("(\\s|^)" + klassName + "(\\s|$)").test(this.className);
};

Element.prototype.addClass = function(klassName) {
  if (!this.hasClass(klassName)) {
    this.className += (this.className ? " " : "") + klassName;
  }
};

Element.prototype.removeClass = function(klassName) {
  if (this.hasClass(klassName)) {
    return this.className = this.className.replace(new RegExp("(\\s|^)" + klassName + "(\\s|$)"), " ").replace(/^s+|\s+$/g, "");
  }
};

(function(global, document) {
  var checkUserId, findUserName, members, processLine, setUserIcon;

  members = null;
  checkUserId = function(nick) {
    var pattern;

    pattern = /_$|_away$/i;
    if (pattern.test(nick)) {
      return nick.replace(pattern, "");
    } else {
      return nick;
    }
  };
  findUserName = function(userId, el) {
    var len;

    len = members.length;
    while (len) {
      len--;
      if (userId === members[len].id) {
        return members[len].name;
      }
    }
    return void 0;
  };
  setUserIcon = function(el, user) {
    var icon;

    icon = document.createElement("div");
    icon.className = "icon";
    icon.style.backgroundImage = "url(avatar/" + user.id + ".png)";
    el.sender.setAttribute("data-name", user.name);
    return el.line.insertBefore(icon, el.sender);
  };
  processLine = function(event) {
    var el, user;

    user = {};
    el = (function() {
      var target;

      target = event.target;
      return {
        line: target,
        type: target.getAttribute("type"),
        nick: target.getAttribute("nick"),
        time: target.getElementsByTagName("span")[0],
        sender: target.getElementsByTagName("span")[1],
        message: target.getElementsByTagName("span")[2]
      };
    })();
    switch (el.type) {
      case "privmsg":
      case "notice":
        if (el.sender.getAttribute("type") === "myself") {
          el.line.addClass("myself");
        }
        if (el.sender.getAttribute("first") === "true") {
          el.line.addClass("first");
          user.id = checkUserId(el.nick);
          user.name = findUserName(user.id, el.line);
          el.line.setAttribute("data-id", user.id);
          el.line.setAttribute("data-name", user.name);
          if (user.name) {
            return setUserIcon(el, user);
          }
        }
    }
  };
  return (function(xhr) {
    xhr.open("GET", "member.json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        switch (xhr.status) {
          case 0:
          case 200:
          case 304:
            members = JSON.parse(xhr.responseText);
            return document.addEventListener("DOMNodeInserted", processLine, false);
        }
      }
    };
    return xhr.send();
  })(new global.XMLHttpRequest());
})(this, this.document);
