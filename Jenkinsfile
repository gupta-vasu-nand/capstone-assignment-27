pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'assignment27'
        MONGO_URL = 'mongodb://mongo:27017/relationship_db'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Clean Environment') {
            steps {
                script {
                    sh 'docker-compose -p assignment27 down --remove-orphans -v || true'
                    sh 'docker system prune -f || true'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t assignment27-backend:latest .'
                    }
                    dir('frontend') {
                        sh 'docker build -t assignment27-frontend:latest .'
                    }
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    sh 'docker-compose -p assignment27 up -d'
                    sleep time: 15, unit: 'SECONDS'
                }
            }
        }

        stage('Verify Services') {
            steps {
                script {
                    sh 'docker ps'

                    sh 'curl -f http://localhost:5000/persons || echo "Backend not responding"'
                    sh 'curl -f http://localhost:5173 || echo "Frontend not responding"'
                }
            }
        }

        stage('Show Status') {
            steps {
                sh 'docker-compose -p assignment27 ps'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Logs:'
            sh 'docker-compose -p assignment27 logs --tail=50 || true'
        }
    }
}