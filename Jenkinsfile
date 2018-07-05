node {
    try {
        stage('Fessサービス停止') {
            sh 'sudo systemctl stop fess'
        }
        stage('ソースの取得') {
            sh 'git clone -b pcl-manual-search https://github.com/inayuky/fess.git'
        }
        stage('パッチの適用') {
            sh 'cd fess && sudo ./apply_patch.sh'
        }
        stage('sorryページの作成') {
            sh 'cd fess && /usr/local/rbenv/shims/ruby make_sorry_page.rb'
        }
        stage('Fessサービス起動') {
            sh 'sudo systemctl start fess'
        }
    } finally {
        sh 'sudo rm -rf fess'
    }
}