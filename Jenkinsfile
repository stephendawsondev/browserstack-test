pipeline {
    agent any

    environment {
        BROWSERSTACK_USERNAME = credentials('browserstack-username')
        BROWSERSTACK_ACCESS_KEY = credentials('browserstack-access-key')
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/stephendawsondev/browserstack-test.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm run test-browserstack'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*.xml', fingerprint: true
            junit 'reports/**/*.xml'
        }
    }
}
