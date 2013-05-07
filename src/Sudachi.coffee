do (global = this, document = this.document) ->
  # imgBase = "https://raw.github.com/tmitz/rails_emoji/master/vendor/assets/images/emojis/"
  imgBase = "emojis/"
  members = null
  xhr     = new global.XMLHttpRequest()

  xhr.open("GET", "member.json")
  xhr.onreadystatechange = ->
    if (xhr.readyState is 4)
      members = JSON.parse(xhr.responseText)
  xhr.send()

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

    switch type
      when "privmsg", "notice"
        emoji      = document.createElement("img")
        sender     = line.getElementsByClassName("sender")[0]
        message    = line.getElementsByClassName("message")[0]
        isFirst    = if sender.getAttribute("first") is "true" then true else false
        matchName  = message.innerHTML.match(/:([\d\w+-_]+):/)
        senderType = sender.getAttribute("type")

        if (isFirst)
          addClass(line, "first")

          nickname   = line.getAttribute("nick")
          pattern    = /_$|_away$/i
          membersLen = members.length
          avatar     = document.createElement("div")

          if pattern.test then nickname = nickname.replace(pattern, "")

          while (membersLen)
            membersLen--

            if nickname is members[membersLen].id
              id   = members[membersLen].id
              name = members[membersLen].name

              sender.setAttribute("data-name", name)
              avatar.className = "avatar"
              avatar.style.backgroundImage = "url(avatar/#{id}.png)"

          line.insertBefore(avatar, sender)

        if senderType is "myself" then addClass(line, "myself")

        emoji.className = "emoji"
        emoji.src       = "#{imgBase}#{matchName[1]}.png"

        line.appendChild(emoji)
        message.innerHTML = message.innerHTML.replace(/:[\d\w+-_]+:/g, "")
  , false