class MembersList
  constructor: (url, callback) ->
    @data = null

    @fetchJSON url, callback

  fetchJSON: (url, callback) ->
    script             = document.createElement "script"
    global["callback"] = (res) =>
      @data = res.data

      body.removeChild script
      if callback then callback()

    script.async = true
    script.src   = url

    body.appendChild script

  getMemberData: (id) ->
    ret = null

    each @data, (data) =>
      if id is data.id
        ret =
          id          : data.id
          screen_name : data.screen_name
          icon_url    : data.icon_url

    return ret
