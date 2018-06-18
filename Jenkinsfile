node {
    try {
        stage('ソースの取得') {
            sh 'git clone -b pcl-manual-search https://github.com/inayuky/fess.git'
        }
        stage('パッチの適用') {
            sh 'cd fess && sudo ./apply_patch.sh'
        }
        stage('Fessサービス再起動') {
            sh 'sudo systemctl restart fess'
        }
    } finally {
        sh 'sudo rm -rf fess'
    }
}