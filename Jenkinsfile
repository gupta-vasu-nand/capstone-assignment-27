pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'assignment27'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo 'Stopping any existing containers...'
                bat 'docker compose down --remove-orphans || exit 0'
            }
        }

        stage('Build & Start Containers') {
            steps {
                echo 'Building and starting Docker containers...'
                bat 'docker compose up --build -d'
            }
        }

        stage('Verify') {
            steps {
                echo 'Verifying containers are running...'
                bat 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! App is running at http://localhost:5173'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
            bat 'docker compose logs || exit 0'
        }
    }
}
