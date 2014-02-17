class MessageHandler
  constructor: ->
    @channelTopic = new Views.ChannelTopic()
    @membersList  = new Models.MemberList JSON_URL, =>
      @memberIcon = new Views.MemberIcon @membersList

    document.addEventListener "DOMNodeInserted", (event) =>
      @handleDOMNodeInsert event
    , false

  getTypeValue: (target) ->
    return if target then target.getAttribute("type") or target.getAttribute("_type") else null

  handleDOMNodeInsert: (event) ->
    element = event.target
    message =
      body   : element
      type   : @getTypeValue element
      id     : element.getAttribute  "nick"
      time   : element.querySelector ".time"
      place  : element.querySelector ".place"
      sender : element.querySelector ".sender"
      text   : element.querySelector ".message"

    switch message.type
      when "reply", "topic"
        @handleTopic message

      when "privmsg", "notice"
        @handleMessage message

  handleTopic: (message) ->
    topicRe  = /\s?topic:\s?.+/i
    hasTopic = topicRe.test message.text.textContent

    if hasTopic
      @channelTopic.update message.text

  handleMessage: (message) ->
    msgSender = message.sender
    msgBody   = message.body
    msgType   = if msgSender then @getTypeValue msgSender else @getTypeValue msgBody
    msgData   = if @membersList then @membersList.getMemberData message.id else null
    isSelf    = msgType is "myself"
    isFirst   = if msgSender and msgSender.getAttribute("first") is "true" then true else false

    if isSelf then msgBody.addClass "myself"
    if isFirst
      msgBody.addClass "first"

      if msgData
        @memberIcon.append msgData, msgBody, msgSender
        msgSender.setAttribute "data-screen-name", msgData.screen_name
