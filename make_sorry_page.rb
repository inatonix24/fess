require 'find'
require 'fileutils'
require "selenium-webdriver"

module FileUtils
    def self.sed_i(file, pattern, replacement)
        File.open(file, "r") do |f_in|
            buf = f_in.read
            buf.gsub!(pattern, replacement)
            File.open(file, "w") do |f_out|
                f_out.write(buf)
            end
        end
    end
end

FileUtils.rm_rf('tempdir')

options = Selenium::WebDriver::Firefox::Options.new
options.add_argument('-headless')
driver = Selenium::WebDriver.for :firefox, options: options

puts "navigate start"
driver.navigate.to "http://localhost"
puts "navigate end"

html_name = "index.html"
Dir.mkdir('tempdir')
Dir.chdir('tempdir')
open(html_name, 'w') {|f|
    f.puts driver.page_source 
}
puts "end get html"

puts "start modify html"
# FileUtils.mv("index.html", html_name)
FileUtils.sed_i(html_name, /;jsessionid.*[0-9A-Z]\"/, '"')
FileUtils.sed_i(html_name, /src=\"\//, 'src="')
FileUtils.sed_i(html_name, /href=\"\//, 'href="')
FileUtils.sed_i(html_name, /<\/head>/, '<link rel="shortcut icon" href="favicon.ico" /></head>')
disabled_form = <<-EOS
<script>
	$('#contentQuery').attr('disabled', true);
	$('#searchButton').attr('disabled', true);
	$('#searchOptionsButton').attr('disabled', true);
	$(".notification").html("サービス時間外です。");
	$(".help-link").css('visibility','hidden');
</script>
EOS
open(html_name, 'a') {|f|
    f.puts disabled_form
}
puts "end modify html"

robots = <<-EOS
User-agent: *
Disallow: /
EOS

open('robots.txt', 'w') {|f|
    f.puts robots
}

puts "start source copy"
source_path = '../src/main/webapp/'
FileUtils.cp_r(source_path + "css", '.')
FileUtils.cp_r(source_path + "images", '.')
FileUtils.cp_r(source_path + "js", '.')
FileUtils.cp_r(source_path + "favicon.ico", '.')
puts "end source copy"

# puts "start aws s3 upload"
# Dir.chdir('..')
# `aws s3 sync tempdir s3://pcl-manual-search-sorry --delete`
# `aws s3api put-bucket-policy --bucket pcl-manual-search-sorry --policy file://public.json`
# puts "end aws s3 upload"
# FileUtils.rm_rf('tempdir')