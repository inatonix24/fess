#!/bin/sh

# 運用中のfessコンテナをイメージに反映
docker commit rms-production ror-manual-search:production

# 前回実行時に作成したtmpディレクトリ削除
rm -rf tmp

# gitのコミット情報から、適用すべき修正ファイルをtmpディレクトリにコピー
srcpathes=`git diff --name-only 978e2e651cbc2688ebecb^ | grep ^src`

for srcpath in $srcpathes
do
  # 以下で変更しているファイルパス以外のファイルを修正したらsedで追加のパス変換が必要。
  destdir=`echo $srcpath | sed -e 's/src\/main\/webapp/app/'`
  destdir=`echo $destdir | sed -e 's/src\/main\/resources/app\/WEB-INF\/classes/'`

  dname=`dirname $destdir`
  mkdir -p tmp/$dname
  \cp -af $srcpath tmp/$dname/
done

# 開発用コンテナとしてビルド
docker build -t ror-manual-search:dev .

# 開発用コンテナを削除して、ビルドしたイメージから起動
docker rm -f rms-dev
docker run -d -p 8181:8080 --name rms-dev ror-manual-search:dev
