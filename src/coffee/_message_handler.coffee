class MessageHandler
  constructor: ->
    document.addEventListener "DOMNodeInserted", (event) =>
      @handleMessage event
    , false

  handleMessage: (event) ->
    element = event.target
    message =
      body   : element
      type   : @getTypeVal element
      id     : element.getAttribute  "nick"
      time   : element.querySelector ".time"
      place  : element.querySelector ".place"
      sender : element.querySelector ".sender"
      text   : element.querySelector ".message"

    switch message.type
      when "privmsg", "notice"
        @setAttrs message

  createMemberIcon: (url) ->
    hasCacheImage = do ->
      ret = null

      each cachedImgUrl, (cached) ->
        if cached.src is url
          return cached

      return ret

    if hasCacheImage
      icon     = hasCacheImage.cloneNode false
    else
      icon     = iconBase.cloneNode false
      icon.src = url
      icon.addClass "icon"

      cachedImages.push icon

    return icon

  getTypeVal: (target) ->
    return if target then target.getAttribute("type") or target.getAttribute("_type") else null

  setAttrs: (message) ->
    sender     = message.sender
    msgType    = @getTypeVal sender
    msgBody    = message.body
    msgData    = membersList.getMemberData message.id
    screenName = if msgData then msgData.screen_name else ""
    iconUrl    = if msgData then msgData.icon_url    else null
    isSelf     = msgType is "myself"
    isFirst    = sender.getAttribute("first") is "true"

    if isSelf then msgBody.addClass "myself"
    if isFirst
      if iconUrl then msgBody.insertBefore @createMemberIcon(iconUrl), sender

      msgBody.addClass "first"
      sender.setAttribute "data-screen-name", screenName

