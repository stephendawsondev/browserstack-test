pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                browserstack(credentialsId: 'b9e4565a-cdab-42f9-999f-3a0c97f6212f') {
                    capabilities([
                        'browserstack.user': "$BROWSERSTACK_USERNAME",
                        'browserstack.key': "$BROWSERSTACK_ACCESS_KEY"
                    ])
                    withCapabilities([
                        'browserstack.email': "$BROWSERSTACK_EMAIL",
                        'browserstack.password': "$BROWSERSTACK_PASSWORD"
                    ]) {
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Test') {
            steps {
                browserstack(credentialsId: 'b9e4565a-cdab-42f9-999f-3a0c97f6212f') {
                    capabilities([
                        'browserstack.user': "$BROWSERSTACK_USERNAME",
                        'browserstack.key': "$BROWSERSTACK_ACCESS_KEY"
                    ])
                    withCapabilities([
                        'browserstack.email': "$BROWSERSTACK_EMAIL",
                        'browserstack.password': "$BROWSERSTACK_PASSWORD"
                    ]) {
                        sh 'npm run test-browserstack'
                    }
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
