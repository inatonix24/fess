require 'net/http'

#マニュアルサーバのホスト名
if ARGV[0]
  hostname = ARGV[0]
else
  puts "please input manual server host name"
  exit 1
end

#該当のマニュアルが存在するか確認用URL
date = '/current/' + Time.now.strftime("%Y%m%d")
q = date + '/ROR/ja/Common/Documentation_Road_Map/index.html'

#確認用のURLへのアクセス
http = Net::HTTP.new(hostname)
req = Net::HTTP::Get.new(q)
res = http.request(req)

#確認用URLにアクセスできた場合にサイトマップを作成
if res.code.to_i < 400

  #サイトマップのURLを生成
  lang =["ja", "en"]

  manual = Hash.new
  manual = {"Common" => ["Documentation_Road_Map", "Glossary", "Messages", "Overview", "Release_Notes", "TroubleShooting"],
    "VirtualEdition" => ["Command", "Design", "Operation", "Setup", "Users"],
    "CloudEdition" => ["API", "Command", "Design", "DROption", "NSOption", "Operation", "QuickStart", "Setup", "Users-IA", "Users-IA-RM", "Users-TA", "Users-TU"]
  }

  url = []
  lang.each do |l|
    manual.each do |key, value|
      value.each do |category|
        url << "http://" + hostname + date + "/ROR/" + l + "/" + key + "/" + category
      end
    end
  end

  #サイトマップの出力先ファイル
  sitemap = "/var/sitemap.xml"

  #ファイルへの書き込み
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

