class MembersList
  constructor: (url, callback) ->
    @data = null

    @fetchJSON url, callback

  fetchJSON: (url, callback) ->
    script          = document.createElement "script"
    global.callback = (res) =>
      @data = res.data

      if callback then callback()

      body.removeChild script
      global.callback = null

    script.async = true
    script.src   = url

    body.appendChild script

  getMemberData: (id) ->
    ret = null

    each @data, (member) =>
      if id is member.id
        ret =
          "id"          : member.id
          "screen_name" : member.screen_name
          "icon_url"    : member.icon_url

    return ret

Models.MembersList = MembersList
