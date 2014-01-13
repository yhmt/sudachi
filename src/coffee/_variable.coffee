body           = document.body
iconBase       = new Image()
cachedImages   = []
messageHandler =
membersList    = null

each = (collection, iterator) ->
  i   = 0
  len = ary = key = undefined

  if Array.isArray collection
    len = collection.length

    while len
      iterator collection[i], i

      ++i
      --len

  else
    ary = Object.keys collection
    len = ary.length

    while len
      key = ary[i]
      iterator key, collection[key]

      ++i
      --len

Element::hasClass = (klass) ->
  this.classList.contains klass

Element::addClass = (klass) ->
  this.classList.add klass

Element::removeClass = (klass) ->
  this.classList.remove klass
