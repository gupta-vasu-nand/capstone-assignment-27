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
                    bat 'docker-compose -p assignment27 down --remove-orphans -v || exit 0'
                    bat 'docker system prune -f || exit 0'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for backend and frontend...'
                dir('backend') {
                    bat 'docker build -t assignment27-backend:latest .'
                }
                dir('frontend') {
                    bat 'docker build -t assignment27-frontend:latest .'
                }
            }
        }

        stage('Start All Containers') {
            steps {
                echo 'Starting containers with Docker Compose...'
                bat 'docker-compose -p assignment27 up -d --build'
                
                echo 'Waiting for containers to initialize...'
                sleep time: 15, unit: 'SECONDS'
            }
        }

        stage('Verify Database') {
            steps {
                echo 'Checking MongoDB connection...'
                script {
                    def maxAttempts = 10
                    for (int i = 1; i <= maxAttempts; i++) {
                        try {
                            def result = bat(script: 'docker exec relationship_db mongosh --eval "db.version()" --quiet', returnStdout: true)
                            echo "MongoDB is ready: ${result.trim()}"
                            break
                        } catch (Exception e) {
                            echo "Attempt ${i}/${maxAttempts}: Waiting for MongoDB..."
                            sleep 5
                        }
                    }
                }
            }
        }

        stage('Verify Backend') {
            steps {
                echo 'Checking backend API health...'
                script {
                    def maxAttempts = 15
                    for (int i = 1; i <= maxAttempts; i++) {
                        try {
                            def statusCode = bat(script: 'curl -s -o nul -w "%%{http_code}" http://localhost:5000/persons', returnStdout: true).trim()
                            if (statusCode == '200') {
                                echo 'Backend API is responding correctly!'
                                break
                            }
                        } catch (Exception e) {
                            echo "Attempt ${i}/${maxAttempts}: Waiting for backend..."
                            sleep 5
                        }
                    }
                }
            }
        }

        stage('Verify Frontend') {
            steps {
                echo 'Checking frontend application...'
                script {
                    def maxAttempts = 15
                    for (int i = 1; i <= maxAttempts; i++) {
                        try {
                            def statusCode = bat(script: 'curl -s -o nul -w "%%{http_code}" http://localhost:5173', returnStdout: true).trim()
                            if (statusCode == '200') {
                                echo 'Frontend application is running!'
                                break
                            }
                        } catch (Exception e) {
                            echo "Attempt ${i}/${maxAttempts}: Waiting for frontend..."
                            sleep 5
                        }
                    }
                }
            }
        }

        stage('Show Container Status') {
            steps {
                echo 'Current container status:'
                bat 'docker-compose -p assignment27 ps'
                echo ''
                echo 'Container logs (last 20 lines):'
                bat 'docker-compose -p assignment27 logs --tail=20'
            }
        }

        stage('Run Relationship Tests') {
            steps {
                echo 'Testing database relationships...'
                script {
                    // Test creating a person with passport (One-to-One)
                    def createPerson = bat(script: '''
                        curl -X POST http://localhost:5000/persons -H "Content-Type: application/json" -d "{\"name\":\"Jenkins Test User\"}"
                    ''', returnStdout: true)
                    echo "Create person response: ${createPerson}"
                    
                    // Test creating a customer with order (One-to-Many)
                    def createCustomer = bat(script: '''
                        curl -X POST http://localhost:5000/customers -H "Content-Type: application/json" -d "{\"name\":\"Jenkins Customer\"}"
                    ''', returnStdout: true)
                    echo "Create customer response: ${createCustomer}"
                }
            }
        }
    }

    post {
        success {
            echo '========================================='
            echo 'PIPELINE SUCCESSFUL - Assignment 27'
            echo '========================================='
            echo 'Application is now running:'
            echo '  • Frontend: http://localhost:5173'
            echo '  • Backend API: http://localhost:5000'
            echo '  • MongoDB: mongodb://localhost:27017'
            echo '  • Jenkins: http://localhost:8080'
            echo '========================================='
        }
        failure {
            echo '========================================='
            echo 'PIPELINE FAILED - Assignment 27'
            echo '========================================='
            echo 'Collecting debug information...'
            bat 'docker-compose -p assignment27 logs --tail=100'
            echo '========================================='
        }
        always {
            echo 'Pipeline execution completed for Assignment 27'
        }
    }
}