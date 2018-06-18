# パッチ適用先のパス
fessdir='/home/centos/fess-11.1.0/'

# このシェルのパス
cwd=`dirname "${0}"`

# 前回実行時に作成したtmpディレクトリ削除
rm -rf $cwd/tmp

# gitのコミット情報から、適用すべき修正ファイルをtmpディレクトリ内にコピー
srcpathes=`git diff --name-only e1bc564fbec712db95a9491960307f50a6f52e27^ | grep ^src`

for srcpath in $srcpathes
do
    # 以下で変更しているファイルパス以外のファイルを修正したらsedで追加のパス変換が必要。
    destdir=`echo $srcpath | sed -e 's/src\/main\/webapp/app/'`
    destdir=`echo $destdir | sed -e 's/src\/main\/resources/app\/WEB-INF\/classes/'`    
    dname=`dirname $destdir`
    mkdir -p $cwd/tmp/$dname
    \cp -af $cwd/$srcpath $cwd/tmp/$dname/
done

# tmp内にコピーしたソースを適用
sudo \cp -rp $cwd/tmp/* $fessdir