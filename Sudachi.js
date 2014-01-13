(function (global, document, undefined) {
var NS = "Sudachi";
var JSON_PATH, MembersList, MessageHandler, body, cachedImages, each, iconBase, membersList, messageHandler,
  _this = this;

JSON_PATH = "https://script.google.com/macros/s/AKfycbzUiWREKXLygBAKA0Dnx1toN5RcxRPrs6OTKiJpUcoCWBkwFEHz/exec";

body = document.body;

iconBase = new Image();

cachedImages = [];

messageHandler = membersList = null;

each = function(collection, iterator) {
  var ary, i, key, len, _results, _results1;
  i = 0;
  len = ary = key = void 0;
  if (Array.isArray(collection)) {
    len = collection.length;
    _results = [];
    while (len) {
      iterator(collection[i], i);
      ++i;
      _results.push(--len);
    }
    return _results;
  } else {
    ary = Object.keys(collection);
    len = ary.length;
    _results1 = [];
    while (len) {
      key = ary[i];
      iterator(key, collection[key]);
      ++i;
      _results1.push(--len);
    }
    return _results1;
  }
};

Element.prototype.hasClass = function(klass) {
  return this.classList.contains(klass);
};

Element.prototype.addClass = function(klass) {
  return this.classList.add(klass);
};

Element.prototype.removeClass = function(klass) {
  return this.classList.remove(klass);
};

MembersList = (function() {
  function MembersList(url, callback) {
    this.data = null;
    this.fetchJSON(url, callback);
  }

  MembersList.prototype.fetchJSON = function(url, callback) {
    var script,
      _this = this;
    script = document.createElement("script");
    global["callback"] = function(res) {
      _this.data = res.data;
      body.removeChild(script);
      if (callback) {
        return callback();
      }
    };
    script.async = true;
    script.src = url;
    return body.appendChild(script);
  };

  MembersList.prototype.getMemberData = function(id) {
    var ret,
      _this = this;
    ret = null;
    each(this.data, function(data) {
      if (id === data.id) {
        return ret = {
          id: data.id,
          screen_name: data.screen_name,
          icon_url: data.icon_url
        };
      }
    });
    return ret;
  };

  return MembersList;

})();

MessageHandler = (function() {
  function MessageHandler() {
    var _this = this;
    document.addEventListener("DOMNodeInserted", function(event) {
      return _this.handleMessage(event);
    }, false);
  }

  MessageHandler.prototype.handleMessage = function(event) {
    var element, message;
    element = event.target;
    message = {
      body: element,
      type: this.getTypeVal(element),
      id: element.getAttribute("nick"),
      time: element.querySelector(".time"),
      place: element.querySelector(".place"),
      sender: element.querySelector(".sender"),
      text: element.querySelector(".message")
    };
    switch (message.type) {
      case "privmsg":
      case "notice":
        return this.setAttrs(message);
    }
  };

  MessageHandler.prototype.createMemberIcon = function(url) {
    var hasCacheImage, icon;
    hasCacheImage = (function() {
      var ret;
      ret = null;
      each(cachedImgUrl, function(cached) {
        if (cached.src === url) {
          return cached;
        }
      });
      return ret;
    })();
    if (hasCacheImage) {
      icon = hasCacheImage.cloneNode(false);
    } else {
      icon = iconBase.cloneNode(false);
      icon.src = url;
      icon.addClass("icon");
      cachedImages.push(icon);
    }
    return icon;
  };

  MessageHandler.prototype.getTypeVal = function(target) {
    if (target) {
      return target.getAttribute("type") || target.getAttribute("_type");
    } else {
      return null;
    }
  };

  MessageHandler.prototype.setAttrs = function(message) {
    var iconUrl, isFirst, isSelf, msgBody, msgData, msgType, screenName, sender;
    sender = message.sender;
    msgType = this.getTypeVal(sender);
    msgBody = message.body;
    msgData = membersList.getMemberData(message.id);
    screenName = msgData ? msgData.screen_name : "";
    iconUrl = msgData ? msgData.icon_url : null;
    isSelf = msgType === "myself";
    isFirst = sender.getAttribute("first") === "true";
    if (isSelf) {
      msgBody.addClass("myself");
    }
    if (isFirst) {
      if (iconUrl) {
        msgBody.insertBefore(this.createMemberIcon(iconUrl), sender);
      }
      msgBody.addClass("first");
      return sender.setAttribute("data-screen-name", screenName);
    }
  };

  return MessageHandler;

})();

membersList = new MembersList(JSON_PATH, function() {
  messageHandler = new MessageHandler();
  return global[NS] = {
    "messageHandler": messageHandler,
    "membersList": membersList
  };
});

})(this, this.document);
