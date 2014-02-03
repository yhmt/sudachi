membersList = new MembersList JSON_PATH, =>
  messageHandler = new MessageHandler()
  global[NS]     =
    "messageHandler" : messageHandler
    "membersList"    : membersList

# document.body.setAttribute "data-debug", window.localStorage
# window.addEventListener "keydown", (event) ->
#   text = document.createTextNode("EVENT")
#   document.body.appendChild text
#   alert "hoge"
