(function (global, document, undefined) {
var NS = "Sudachi";
var ChannelTopic, JSON_URL, MemberIcon, MemberList, MessageHandler, Models, Utils, Views, body, debugObject, messageHandler;

Models = Views = Utils = {};

JSON_URL = "https://script.google.com/macros/s/AKfycbzUiWREKXLygBAKA0Dnx1toN5RcxRPrs6OTKiJpUcoCWBkwFEHz/exec";

body = document.body;

debugObject = document.createElement("pre");

debugObject.className = "debug-log";

console.log = function(obj) {
  var log;
  log = debugObject.cloneNode(false);
  log.innerText = typeof obj === "string" ? obj : JSON.stringify(obj);
  return body.appendChild(log);
};


var each = function(collection, iterator) {
    var i = 0,
        len, ary, key;

    if (Array.isArray(collection)) {
        len = collection.length;

        for (; len; ++i, --len) {
            iterator(collection[i], i);
        }
    }
    else {
        ary = Object.keys(collection);
        len = ary.length;

        for (; len; ++i, --len) {
            key = ary[i];
            iterator(key, collection[key]);
        }
    }
}
;

Element.prototype.hasClass = function(klass) {
  return this.classList.contains(klass);
};

Element.prototype.addClass = function(klass) {
  return this.classList.add(klass);
};

Element.prototype.removeClass = function(klass) {
  return this.classList.remove(klass);
};

MemberList = (function() {
  function MemberList(url, callback) {
    this.data = null;
    this.fetchJSON(url, callback);
  }

  MemberList.prototype.fetchJSON = function(url, callback) {
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

  MemberList.prototype.getMemberData = function(nick) {
    var ret,
      _this = this;
    ret = null;
    each(this.data, function(member) {
      if (nick === member.nick) {
        return ret = {
          "nick": member.nick,
          "name": member.name,
          "icon_url": member.icon_url
        };
      }
    });
    return ret;
  };

  return MemberList;

})();

Models.MemberList = MemberList;

MemberIcon = (function() {
  function MemberIcon(model) {
    this.model = model;
    this.iconBase = document.createElement("div");
  }

  MemberIcon.prototype.append = function(data, parentElement, referenceElement) {
    var icon;
    if (!(data || parentElement || referenceElement)) {
      return;
    }
    icon = this.iconBase.cloneNode(false);
    icon.style.backgroundImage = "url(" + data.icon_url + ")";
    icon.addClass("icon");
    return parentElement.insertBefore(icon, referenceElement);
  };

  MemberIcon.prototype.destory = function() {};

  return MemberIcon;

})();

Views.MemberIcon = MemberIcon;

ChannelTopic = (function() {
  function ChannelTopic() {
    this.anchorBase = document.createElement("a");
    this.element = document.createElement("p");
    this.topicbar = document.createElement("div");
    this.topicbar.id = "topic-bar";
    this.topicbar.appendChild(this.element);
    body.appendChild(this.topicbar);
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
      anchor = this.anchorBase.cloneNode(false);
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
    this.membersList = new Models.MemberList(JSON_URL, function() {
      return _this.memberIcon = new Views.MemberIcon(_this.membersList);
    });
    document.addEventListener("DOMNodeInserted", function(event) {
      return _this.handleDOMNodeInsert(event);
    }, false);
  }

  MessageHandler.prototype.getTypeValue = function(target) {
    if (target) {
      return target.getAttribute("type") || target.getAttribute("_type");
    } else {
      return null;
    }
  };

  MessageHandler.prototype.handleDOMNodeInsert = function(event) {
    var element, message;
    element = event.target;
    message = {
      body: element,
      type: this.getTypeValue(element),
      nick: element.getAttribute("nick"),
      time: element.querySelector(".time"),
      place: element.querySelector(".place"),
      sender: element.querySelector(".sender"),
      text: element.querySelector(".message")
    };
    switch (message.type) {
      case "reply":
      case "topic":
        return this.handleTopic(message);
      case "privmsg":
      case "notice":
        return this.handleMessage(message);
    }
  };

  MessageHandler.prototype.handleTopic = function(message) {
    var hasTopic, topicRe;
    topicRe = /\s?topic:\s?.+/i;
    hasTopic = topicRe.test(message.text.textContent);
    if (hasTopic) {
      return this.channelTopic.update(message.text);
    }
  };

  MessageHandler.prototype.handleMessage = function(message) {
    var isFirst, isSelf, msgBody, msgData, msgSender, msgType;
    msgSender = message.sender;
    msgBody = message.body;
    msgType = msgSender ? this.getTypeValue(msgSender) : this.getTypeValue(msgBody);
    msgData = this.membersList ? this.membersList.getMemberData(message.nick) : null;
    isSelf = msgType === "myself";
    isFirst = msgSender && msgSender.getAttribute("first") === "true" ? true : false;
    if (isSelf) {
      msgBody.addClass("myself");
    }
    if (isFirst) {
      msgBody.addClass("first");
      if (msgData) {
        this.memberIcon.append(msgData, msgBody, msgSender);
        return msgSender.setAttribute("data-screen-name", msgData.screen_name);
      }
    }
  };

  return MessageHandler;

})();

messageHandler = new MessageHandler();

})(this, this.document);
