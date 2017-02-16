require "open-uri"

hostname = "http://software.fujitsu.com"

#バージョンつきの過去版マニュアル
vl_to_html_with_version = {
  "320VE" => ["p15000125.html"],
  "320CE" => ["p15000117.html","p15000122.html","p15000123.html"],
  "312VE" => ["p13000647.html"],
  "312CE" => ["p13000646.html", "p13000656.html", "p13000657.html"],
  "311AVE" => ["p13000214.html"],
  "311ACE" => ["p13000213.html", "p13000309.html"],
  "311VE" => ["p13000097.html"],
  "311CE" => ["p13000090.html", "p13000100.html", "p13000099.html"],
  "310AVE" => ["p12000432.html"],
  "310ACE" => ["p12000430.html", "p12000428.html", "p12000403.html"],
  "310VE" => ["p12000229.html"],
  "310CE" => ["p12000228.html", "p12000256.html"],
  "300VE" => ["p11000307.html"],
  "300CE" => ["p11000308.html"]
  }

# 過去版のマニュアル
# Aがつくやつは、他とURLがかぶったりしてうまくいかなかったので除外している
vl = ["320", "312", "311", "310", "300"]
vl_to_html = Hash.new
vl.each do |v|
  vl_to_html.store(v, vl_to_html_with_version[v + "VE"] + vl_to_html_with_version[v + "CE"])
end

vl_to_html_all = vl_to_html

# VEとCEのsitemapもわけて出力したい場合
#vl_to_html_all = vl_to_html.merge(vl_to_html_with_version)

puts vl_to_html_all.inspect

vl_to_html_all.each do |manual, htmls|
  #各マニュアルのURLを抽出
  url = []
  htmls.each do |html|
    puts html
    f = open(hostname + "/jp/manual/manualindex/" + html)
    f.each_line {|line|
      url << hostname + $1 if line =~ /(\/jp\/manual\/manualfiles\/.......\/........\/......\/index.html)/
    }
    url.uniq!
    f.close
  end

  puts url.length
  puts manual
  #サイトマップを作成
  sitemap = "/var/sitemap_" + manual + ".xml"
  f = open(sitemap,"w")
  f.write "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
  f.write "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
  url.each do |u|
    f.write "<url>\n"
    f.write "<loc>" + u + "</loc>\n"
    f.write "</url>\n"
  end
  f.write "</urlset>"
  f.close
end



