class ChannelTopic
  constructor: ->
    @anchorBase = document.createElement "a"
    @element    = document.createElement "div"
    @element.id = "topic-bar"

    body.appendChild @element

  clean: ->
    @element.innerHTML = ""

  update: (text) ->
    @clean()

    link = text.querySelector "a.url"
    url  = if link then link.textContent else null

    if url
      anchor           = @anchorBase.cloneNode false
      anchor.className = "url"
      anchor.href      =
      anchor.innerText = url

      anchor.setAttribute "oncontextmenu", "on_url()"
      @element.appendChild anchor
    else
      @element.innerText = text.textContent.replace /^[\w|\s]+?\s?topic:\s/i, ""

    body.addClass "topic-enable"

Views.ChannelTopic = ChannelTopic
