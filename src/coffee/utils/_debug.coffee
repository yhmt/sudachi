debugObject           = document.createElement "pre"
debugObject.className = "debug-log"

console.log = (obj) ->
  log           = debugObject.cloneNode false
  log.innerText = if typeof obj is "string" then obj else JSON.stringify obj

  body.appendChild log
