Element.prototype.hasClass = (klassName) ->
  new RegExp("(\\s|^)#{klassName}(\\s|$)").test(@className)

Element.prototype.addClass = (klassName) ->
  unless @hasClass(klassName)
    @className += (if @className then " " else "") + klassName
    return

Element.prototype.removeClass = (klassName) ->
  if @hasClass(klassName)
    @className = @className.replace(new RegExp("(\\s|^)#{klassName}(\\s|$)"), " ").replace(/^s+|\s+$/g, "")