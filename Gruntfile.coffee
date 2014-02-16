matchdep = require "matchdep"
opts     = do ->
  if process.argv[2] isnt undefined
    args = process.argv[2].split ":"
    return {
      task       : args[0]
      env        : if args[1] is ("dev" or "development") then "dev" else "prod"
      livereload : if args[2] then true  else false
    }
  else
    return {
      env        : "prod"
      livereload : false
    }

GASEditorUrl   = "https://script.google.com/macros/d/M-gqawwE45MDT6VmVX2GBLvU7gQ7yGVRP/edit"
module.exports = (grunt) ->
  config =
    pkg: grunt.file.readJSON "package.json"

    exec:
      purr:
        cmd: -> "afplay /System/Library/Sounds/Purr.aiff"
      sync:
        cmd: -> "tools/sync_files.sh"
      reload:
        cmd: -> "tools/reload_theme.scpt"
      lint_gas_prepare:
        cmd: -> "cp -f src/gas/Code.gs src/gas/Code.js"
      lint_gas_restore:
        cmd: -> "rm -f src/gas/Code.js"
      pbcopy_gas_file:
        cmd: -> "node tools/pbcopy.js #{__dirname}/src/gas/Code.gs | pbcopy"
      open_gas_editor:
        cmd: -> "tools/open_gas_editor.scpt #{GASEditorUrl}"

    esteWatch:
      options:
        dirs: [
          "src/coffee/**/"
          "src/compass/**/"
          "src/gas/**/"
        ]
        livereload:
          enabled: false

      coffee: (filePath) ->
        ret = ["coffee", "jshint:main"]

        if opts.livereload then ret.push "reload"

        return ret

      sass: (filePath) ->
        task = if opts.env is "prod" then "prod" else "dev"
        ret  = ["compass:#{task}"]

        if opts.livereload then ret.push "reload"

        return ret

      gs: (filePath) ->
        ret = [
          "exec:lint_gas_prepare"
          "jshint:gas"
          "exec:lint_gas_restore"
          "exec:pbcopy_gas_file"
          "exec:open_gas_editor"
        ]

        return ret

    coffee:
      dist:
        options:
          join: true
          bare: true
        files:
          "Sudachi.js": [
            "src/coffee/_intro.coffee"
            "src/coffee/_CONFIG.coffee"
            "src/coffee/_variable.coffee"
            "src/coffee/utils/_debug.coffee"
            "src/coffee/utils/_function.coffee"
            "src/coffee/utils/_prototype.coffee"
            "src/coffee/models/_member_list.coffee"
            "src/coffee/views/_member_icon.coffee"
            "src/coffee/views/_channel_topic.coffee"
            "src/coffee/_message_handler.coffee"
            "src/coffee/Sudachi.coffee"
            "src/coffee/_outro.coffee"
          ]

    compass:
      prod:
        options:
          environment: "production"
          config: "src/compass/config.rb"
      dev:
        options:
          environment: "development"
          config: "src/compass/config.rb"

    jshint:
      main    : ["Sudachi.js"]
      gas     : ["src/gas/Code.js"]
      options : do ->
        ret = { globals: {} }
        opt = ["eqeqeq" , "immed"  , "latedef" , "shadow" , "sub" , "undef" ,
               "boss"   , "eqnull" , "browser" , "devel"  , "loopfunc"]
        ns  = ["SpreadsheetApp" , "DriveApp" , "UrlFetchApp" , "ScriptProperties"
               "ContentService" , "Browser"  , "Utilities"]

        for o in opt then ret[o]         = true
        for n in ns  then ret.globals[n] = true

        return ret

  grunt.initConfig config
  matchdep.filterDev("grunt-*").forEach grunt.loadNpmTasks

  grunt.registerTask "default", ["esteWatch"]
  # grunt.registerTask "reload",  ["exec:sync", "exec:reload", "exec:purr"]
  grunt.registerTask "reload",  ["exec:sync", "exec:purr"]

  grunt.registerTask "watch", "watching coffee/compass files.", ->
    console.log "environment : %s", opts.env
    console.log "livereload  : %s", opts.livereload

    grunt.task.run "esteWatch"
