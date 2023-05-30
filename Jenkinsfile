pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                withCredentials([usernameColonPassword(credentialsId: 'login_credentials', variable: 'LOGIN_CREDENTIALS')]) {
                    browserstack(credentialsId: 'b9e4565a-cdab-42f9-999f-3a0c97f6212f') {
                        sh "export LOGIN_CREDENTIALS=${LOGIN_CREDENTIALS} && npm install"
                    }
                }
            }
        }
        stage('Test') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'browserstack_credentials', usernameVariable: 'BROWSERSTACK_USERNAME', passwordVariable: 'BROWSERSTACK_ACCESS_KEY')]) {
                    sh "export BROWSERSTACK_USERNAME=${BROWSERSTACK_USERNAME} && export BROWSERSTACK_ACCESS_KEY=${BROWSERSTACK_ACCESS_KEY} && npm run test-browserstack"
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
