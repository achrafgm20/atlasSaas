pipeline {
    agent any

    stages {

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Restart Containers') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }

    // post {
    //     success {
    //         echo 'AtlasSaas deployed successfully 🚀'
    //     }
    //     failure {
    //         echo 'Deployment failed ❌'
    //     }
    // }
    post {
    success {
        emailext(
            subject: "Deployment SUCCESS",
            body: "Build successful",
            to: "hibaaitabdellah81@gmail.com"
        )
    }
    failure {
        emailext(
            subject: "Deployment FAILED",
            body: "Check console: ${env.BUILD_URL}console",
            to: "hibaaitabdellah81@gmail.com"
        )
    }
}
}