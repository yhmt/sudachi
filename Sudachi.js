(function (global, document, undefined) {
var NS = "Sudachi";
var ChannelTopic, JSON_PATH, MemberIcon, MembersList, MessageHandler, Models, Utils, Views, anchorBase, body, cachedImages, debugObject, each, iconBase, membersList, messageHandler,
  _this = this;

Models = Views = Utils = {};

JSON_PATH = "https://script.google.com/macros/s/AKfycbzUiWREKXLygBAKA0Dnx1toN5RcxRPrs6OTKiJpUcoCWBkwFEHz/exec";

body = document.body;

iconBase = document.createElement("div");

anchorBase = document.createElement("a");

cachedImages = [];

messageHandler = membersList = null;

debugObject = document.createElement("pre");

debugObject.className = "debug-log";

console.log = function(obj) {
  var log;
  log = debugObject.cloneNode(false);
  log.innerText = typeof obj === "string" ? obj : JSON.stringify(obj);
  return body.appendChild(log);
};

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
    global.callback = function(res) {
      _this.data = res.data;
      if (callback) {
        callback();
      }
      body.removeChild(script);
      return global.callback = null;
    };
    script.async = true;
    script.src = url;
    return body.appendChild(script);
  };

  MembersList.prototype.getMemberData = function(id) {
    var ret,
      _this = this;
    ret = null;
    each(this.data, function(member) {
      if (id === member.id) {
        return ret = {
          "id": member.id,
          "screen_name": member.screen_name,
          "icon_url": member.icon_url
        };
      }
    });
    return ret;
  };

  return MembersList;

})();

Models.MembersList = MembersList;

MemberIcon = (function() {
  function MemberIcon(body, sender, url) {
    this.icon = iconBase.cloneNode(false);
    this.icon.style.backgroundImage = "url(" + url + ")";
    this.icon.addClass("icon");
    this.append(body, sender);
  }

  MemberIcon.prototype.append = function(body, sender) {
    body.insertBefore(this.icon, sender);
    return this.destory();
  };

  MemberIcon.prototype.destory = function() {};

  return MemberIcon;

})();

Views.MemberIcon = MemberIcon;

ChannelTopic = (function() {
  function ChannelTopic() {
    this.element = document.createElement("div");
    this.element.id = "topic";
    body.appendChild(this.element);
    console.log("ChannelTopic Init");
  }

  ChannelTopic.prototype.clean = function() {
    return this.element.innerHTML = "";
  };

  ChannelTopic.prototype.update = function(text) {
    var anchor, link, url;
    this.clean();
    link = text.querySelector("a.url");
    url = link ? link.textContent : null;
    if (url) {
      anchor = anchorBase.cloneNode(false);
      anchor.className = "url";
      anchor.href = anchor.innerText = url;
      anchor.setAttribute("oncontextmenu", "on_url()");
      this.element.appendChild(anchor);
    } else {
      this.element.innerText = text.textContent.replace(/^[\w|\s]+?\s?topic:\s/i, "");
    }
    return body.addClass("topic-enable");
  };

  return ChannelTopic;

})();

Views.ChannelTopic = ChannelTopic;

MessageHandler = (function() {
  function MessageHandler() {
    var _this = this;
    this.channelTopic = new Views.ChannelTopic();
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
      case "reply":
      case "topic":
        return this.setAttrs(message);
    }
  };

  MessageHandler.prototype.createMemberIcon = function(url) {
    var hasCacheImage, icon;
    hasCacheImage = (function() {
      var ret;
      ret = null;
      each(cachedImages, function(cached) {
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
      icon.style.backgroundImage = "url(" + url + ")";
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
    var hasTopic, isFirst, isSelf, msgBody, msgType, sender;
    sender = message.sender;
    msgBody = message.body;
    msgType = sender ? this.getTypeVal(sender) : this.getTypeVal(msgBody);
    hasTopic = (msgType === "reply" || msgType === "topic") && /\s?topic:/i.test(message.text.textContent);
    isSelf = msgType === "myself";
    isFirst = sender ? sender.getAttribute("first") : false;
    console.log(msgType === "reply" || msgType === "topic");
    console.log(/\s?topic:/i.test(message.text.textContent));
    console.log(hasTopic);
    if (hasTopic) {
      return this.channelTopic.update(message.text);
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
