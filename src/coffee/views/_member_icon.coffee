class MemberIcon
  constructor: (body, sender, url) ->
    @icon = iconBase.cloneNode false
    @icon.style.backgroundImage = "url(#{url})"
    @icon.addClass "icon"

    @append body, sender

  append: (body, sender) ->
    body.insertBefore @icon, sender

    @destory()

  destory: ->
    # @ = null

Views.MemberIcon = MemberIcon