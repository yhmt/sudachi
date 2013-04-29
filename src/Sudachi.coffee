do (global = this, document = this.document) ->
  # imgBase = "https://raw.github.com/tmitz/rails_emoji/master/vendor/assets/images/emojis/"
  imgBase = "emojis/"

  hasClass = (el, name) ->
    new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className)

  addClass = (el, name) ->
    unless hasClass(el, name)
      el.className += (if el.className then " " else "") + name;
      return

  removeClass = (el, name) ->
    if hasClass(el, name)
      el.className = el.className.replace(new RegExp("(\\s|^)" + name + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, "");
      return

  document.addEventListener "DOMNodeInserted", (event) ->
    line   = event.target
    type   = line.getAttribute("type")
    nick   = line.getAttribute("nick")
    avatar = document.createElement("div")
    emoji  = document.createElement("img")

    switch type
      when "privmsg"
        sender     = line.getElementsByClassName("sender")[0]
        isFirst    = if sender.getAttribute("first") is "true" then true else false
        message    = line.getElementsByClassName("message")[0]
        matchName  = message.innerHTML.match(/:([\d\w+-_]+):/)
        senderType = sender.getAttribute("type")

        if (isFirst)
          addClass(line, "first")
          sender.setAttribute("data-name", "橋本 雄也")

          avatar.className = "avatar"
          avatar.style.backgroundImage = "url(avatar/#{nick}.png)"
          line.insertBefore(avatar, sender)

        if senderType is "myself"
          addClass(line, "myself")

        emoji.className = "emoji"
        emoji.src       = "#{imgBase}#{matchName[1]}.png"

        line.appendChild(emoji)
        message.innerHTML = message.innerHTML.replace(/:[\d\w+-_]+:/g, "")

      # when "privmsg", "notice"
      #   msg   = line.getElementsByClassName("message")[0]
      #   emoji = msg.innerHTML.match(/:([\d\w+-_]+):/)

      #   # if emoji return

      #   icon.className = "emoji"
      #   icon.src       = "#{imgBase}#{emoji[1]}.png"

      #   line.appendChild(icon)
      #   msg.innerHTML = msg.innerHTML.replace(/:[\d\w+-_]+:/g, "")



  , false