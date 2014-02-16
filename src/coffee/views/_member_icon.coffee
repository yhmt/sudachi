class MemberIcon
  constructor: (model) ->
    @model    = model
    @iconBase = document.createElement "div"

  append: (data, parentElement, referenceElement) ->
    unless data or parentElement or referenceElement then return

    icon = @iconBase.cloneNode false
    icon.style.backgroundImage = "url(#{data.icon_url})"
    icon.addClass "icon"

    parentElement.insertBefore icon, referenceElement

  destory: ->
    # @ = null

Views.MemberIcon = MemberIcon
