class MemberList
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

  getMemberData: (nick) ->
    ret = null

    each @data, (member) =>
      if nick is member.nick
        ret =
          "nick"     : member.nick
          "name"     : member.name
          "icon_url" : member.icon_url

    return ret

Models.MemberList = MemberList
