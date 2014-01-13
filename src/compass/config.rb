# プロジェクトのパス
project_path     = File.dirname(__FILE__) + "/../../"
# .sass 形式を使用する
preferred_syntax = :sass
# 相対パスを許可するか
relative_assets  = false

# Asset へのディレクトリパス (project_path からの相対パスで指定)
sass_dir        = "src/compass"
css_dir         = "./"
images_dir      = "img/"
javascripts_dir = "js/"
fonts_dir       = "fonts/"

# Web サーバー上でのディレクトリパス
http_path             = "/"
http_stylesheets_path = http_path + "css/"
http_images_path      = http_path + "img/"
http_javascripts_path = http_path + "js/"
http_fonts_path       = http_path + "fonts/"

if environment == :development
    output_style  = :expanded
    line_comments = true
else
    output_style  = :expanded
    line_comments = false
end
