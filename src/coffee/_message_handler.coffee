class MessageHandler
  constructor: ->
    @channelTopic = new Views.ChannelTopic()

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
      when "privmsg", "notice", "reply", "topic"
        @setAttrs message

    # @setAttrs message

  createMemberIcon: (url) ->
    hasCacheImage = do ->
      ret = null

      each cachedImages, (cached) ->
        if cached.src is url
          return cached

      return ret

    if hasCacheImage
      icon = hasCacheImage.cloneNode false
    else
      icon = iconBase.cloneNode false
      icon.style.backgroundImage = "url(#{url})"
      icon.addClass "icon"

      cachedImages.push icon

    return icon

  getTypeVal: (target) ->
    return if target then target.getAttribute("type") or target.getAttribute("_type") else null

  setAttrs: (message) ->
    # console.log "setAttrs"

    sender     = message.sender
    msgBody    = message.body
    msgType    = if sender then @getTypeVal sender else @getTypeVal msgBody
    # msgData    = membersList.getMemberData message.id
    # screenName = if msgData then msgData.screen_name else ""
    # iconUrl    = if msgData then msgData.icon_url    else null
    hasTopic   = (msgType is "reply" or msgType is "topic") and /\s?topic:/i.test message.text.textContent
    isSelf     = msgType is "myself"
    isFirst    = if sender then sender.getAttribute "first" else false

    # console.log message.text.textContent
    console.log msgType is "reply" or msgType is "topic"
    console.log /\s?topic:/i.test(message.text.textContent)
    console.log hasTopic

    if hasTopic then @channelTopic.update message.text
    # if isSelf   then msgBody.addClass "myself"
    # if isFirst
    #   if iconUrl then msgBody.insertBefore @createMemberIcon(iconUrl), sender
    #   # if iconUrl then new Views.MemberIcon msgBody, sender, iconUrl

    #   msgBody.addClass "first"
    #   sender.setAttribute "data-screen-name", screenName

