Element::hasClass = (klass) ->
  this.classList.contains klass

Element::addClass = (klass) ->
  this.classList.add klass

Element::removeClass = (klass) ->
  this.classList.remove klass
