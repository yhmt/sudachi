((global, document) ->
    "use strict"

    # class Sudachi
    #     constructor: ->
    #         @doc  = document
    #         @body = document.body

    #         @addListeners()
    #     addListeners: ->
    #         # processNode = (event) =>

    #         @doc.addEventListner("DOMNodeInserted", insertEmoji, false)
    #     insertEmoji: (event) ->
    #         line = event.target
    #         type = line.getAttribute("type")

    #         switch type
    #             when "privmsg"
    #                 imgBase = "https://raw.github.com/tmitz/rails_emoji/master/vendor/assets/images/emojis/"
    #                 message = line.getElementsByClassName("message")[0]

    #                 emoji = message.innerHTML.match(/:([\d\w+-_]+):/)
    #                 icon = document.createElement("img")

    #                 icon.className = "emoji"
    #                 icon.src = imgBase + "pig" + ".png"

    #                 line.appendChild(icon)
    #                 break


    # return new Sudachi

    document.addEventListner("DOMNodeInserted", (event) ->
        line = event.target;
        icon = document.createElement("img");

        icon.src = "http://coffeescript.org/documentation/images/logo.png";
        line.appendChild(icon);
        @
    , false)

)(this, this.document)