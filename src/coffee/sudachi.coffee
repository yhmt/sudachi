do (global = this, document = this.document) ->
  members  = null

  checkUserId = (nick) ->
    pattern = /_$|_away$/i

    if pattern.test(nick)
      userId = nick.replace(pattern, "")

  findUserName = (userId, el) ->
    len = members.length

    while (len)
      len--

      if userId is members[len].id
        return members[len].name
    return undefined

  setUserIcon = (el, user) ->
    icon = document.createElement("div")

    icon.className = "icon"
    icon.style.backgroundImage = "url(avatar/#{user.id}.png)"

    el.sender.setAttribute("data-name", user.name)
    el.line.insertBefore(icon, el.sender)

  processLine = (event) ->
    user = {}
    el   = do ->
      target = event.target

      return {
        line:    target
        type:    target.getAttribute("type")
        nick:    target.getAttribute("nick")
        time:    target.getElementsByTagName("span")[0]
        sender:  target.getElementsByTagName("span")[1]
        message: target.getElementsByTagName("span")[2]
      }

    switch el.type
      when "privmsg", "notice"
        if el.sender.getAttribute("type") is "myself"
          el.line.addClass("myself")
        if el.sender.getAttribute("first") is "true"
          el.line.addClass("first")

          user.id   = checkUserId(el.nick)
          user.name = findUserName(user.id, el.line)

          el.line.setAttribute("data-id", user.id)
          el.line.setAttribute("data-name", user.name)

          if user.name then setUserIcon(el, user)

  do (xhr = new global.XMLHttpRequest()) ->
    xhr.open("GET", "member.json")
    xhr.onreadystatechange = ->
      if xhr.readyState is 4
        members = JSON.parse(xhr.responseText)
        document.addEventListener "DOMNodeInserted", processLine, false
    xhr.send()
