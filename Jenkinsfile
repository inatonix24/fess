node {
    try {
        stage('ソースの取得') {
            sh 'git clone -b pcl-manual-search https://github.com/inayuky/fess.git'
        }
        stage('パッチの適用') {
            sh 'cd fess && sudo ./apply_patch.sh'
        }
        stage('sorryページの作成') {
            sh 'cd fess && /usr/local/rbenv/shims/ruby make_sorry_page.rb'
        }
        stage('sorryページのアップロード') {
            sh 'sudo /root/.local/bin/aws s3 sync tempdir s3://pcl-manual-search-sorry --delete'
        }
        stage('sorryページの公開') {
            sh 'sudo /root/.local/bin/aws s3api put-bucket-policy --bucket pcl-manual-search-sorry --policy file://public.json'
        }
        stage('Fessサービス再起動') {
            sh 'sudo systemctl restart fess'
        }
    } finally {
        sh 'sudo rm -rf fess'
    }
}