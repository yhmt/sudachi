module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    exec:
      sync:
        cmd: -> "./sync.sh"
    coffee:
      src:
        options:
          bare: true
        files:
          "Sudachi.js": "src/Sudachi.coffee"
    watch:
      src:
        files: ["src/*.coffee"]
        tasks: "compile"
    jshint:
      src: ["Sudachi.js"]
      options:
        curly:   true
        eqeqeq:  true
        immed:   true
        latedef: true
        newcap:  true
        noarg:   true
        sub:     true
        undef:   true
        boss:    true
        eqnull:  true
        es5:     true
        dojo:    true
        devel:   true

  grunt.loadNpmTasks "grunt-exec"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  # grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-notify"

  grunt.registerTask "compile", ["coffee:src", "jshint:src", "exec:sync"]
  grunt.registerTask "test",    ["coffee:test", "exec:mocha"]
  # grunt.registerTask "prod",    ["compile", "test", "uglify"]
  grunt.registerTask "prod",    ["compile"]

  grunt.registerTask "default", ["prod"]
