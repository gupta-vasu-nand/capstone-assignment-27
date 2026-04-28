pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'assignment27'
        MONGO_URL = 'mongodb://mongo:27017/relationship_db'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '========================================='
                echo 'Cloning repository for Assignment 27...'
                echo '========================================='
                checkout scm
            }
        }

        stage('Clean Environment') {
            steps {
                echo 'Cleaning up old containers...'
                script {
                    sh 'docker compose -p assignment27 down --remove-orphans -v || true'
                    sh 'docker system prune -f || true'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
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
                echo 'Starting containers...'
                script {
                    sh 'docker compose -p assignment27 up -d'
                    sleep time: 15, unit: 'SECONDS'
                }
            }
        }

        stage('Verify Services') {
            steps {
                echo 'Verifying services...'
                script {
                    // Check MongoDB
                    sh 'docker ps | grep relationship_db || echo "MongoDB not running"'
                    
                    // Check Backend
                    sh 'curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/persons || echo "Backend not responding"'
                    
                    // Check Frontend
                    sh 'curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173 || echo "Frontend not responding"'
                }
            }
        }

        stage('Show Status') {
            steps {
                echo 'Container Status:'
                sh 'docker compose -p assignment27 ps'
            }
        }
    }

    post {
        success {
            echo '========================================='
            echo ' PIPELINE SUCCESSFUL - Assignment 27'
            echo '========================================='
            echo 'Application URLs:'
            echo '  • Frontend: http://localhost:5173'
            echo '  • Backend: http://localhost:5000'
            echo '  • MongoDB: mongodb://localhost:27017'
            echo '========================================='
        }
        failure {
            echo '========================================='
            echo ' PIPELINE FAILED - Assignment 27'
            echo '========================================='
            echo 'Collecting logs...'
            sh 'docker compose -p assignment27 logs --tail=50 || true'
        }
    }
}