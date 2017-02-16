#!/bin/sh

# 取り込む修正がtmpに存在するかの確認（開発用コンテナを作成すれば作成される）
if [ ! -e tmp ]; then
   echo "source(tmp) directory doesn't exist. (build for development before)"
   exit 1
fi

# 運用コンテナをイメージ化して退避
docker commit rms-production ror-manual-search:production

# 運用コンテナのビルド
docker build -t ror-manual-search:production .

# 修正ファイルを格納したtmpディレクトリを削除
rm -rf tmp

# 既存の運用コンテナの削除して、ビルドしたイメージから起動
docker rm -f rms-production
docker run -d -p 8080:8080 --net=host --name rms-production ror-manual-search:production

