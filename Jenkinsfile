pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'assignment27'
        MONGO_URL = 'mongodb://mongo:27017/relationship_db'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        skipDefaultCheckout()
    }

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: 'Deployment environment'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run API tests after deployment'
        )
        booleanParam(
            name: 'CLEAN_VOLUMES',
            defaultValue: false,
            description: 'Remove volumes during cleanup'
        )
    }

    stages {

        stage('Initialize') {
            steps {
                echo '========================================='
                echo 'Assignment 27 - Database Relationships Demo'
                echo '========================================='
                echo "Deployment Environment: ${params.DEPLOY_ENV}"
                echo "Run Tests: ${params.RUN_TESTS}"
                
                script {
                    // Detect OS and set commands
                    if (isUnix()) {
                        env.DOCKER_COMPOSE_CMD = 'docker-compose'
                        env.CURL_CMD = 'curl'
                        env.NULL_OUTPUT = '/dev/null'
                    } else {
                        env.DOCKER_COMPOSE_CMD = 'docker-compose.exe'
                        env.CURL_CMD = 'curl.exe'
                        env.NULL_OUTPUT = 'nul'
                    }
                    
                    // Set environment-specific variables
                    if (params.DEPLOY_ENV == 'production') {
                        env.NODE_ENV = 'production'
                    } else {
                        env.NODE_ENV = 'development'
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                echo 'Cloning repository for Assignment 27...'
                checkout scm
                
                script {
                    if (isUnix()) {
                        env.GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                        env.GIT_BRANCH = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    } else {
                        env.GIT_COMMIT = bat(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                        env.GIT_BRANCH = bat(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    }
                    echo "Git Commit: ${env.GIT_COMMIT}"
                    echo "Git Branch: ${env.GIT_BRANCH}"
                }
            }
        }

        stage('Environment Validation') {
            parallel {
                stage('Check Docker') {
                    steps {
                        echo 'Checking Docker installation...'
                        script {
                            if (isUnix()) {
                                def dockerVersion = sh(script: 'docker --version', returnStdout: true)
                                echo "Docker Version: ${dockerVersion.trim()}"
                            } else {
                                def dockerVersion = bat(script: 'docker --version', returnStdout: true)
                                echo "Docker Version: ${dockerVersion.trim()}"
                            }
                        }
                    }
                }
                
                stage('Check Docker Compose') {
                    steps {
                        echo 'Checking Docker Compose installation...'
                        script {
                            if (isUnix()) {
                                def composeVersion = sh(script: 'docker-compose --version', returnStdout: true)
                                echo "Docker Compose Version: ${composeVersion.trim()}"
                            } else {
                                def composeVersion = bat(script: 'docker-compose --version', returnStdout: true)
                                echo "Docker Compose Version: ${composeVersion.trim()}"
                            }
                        }
                    }
                }
            }
        }

        stage('Clean Environment') {
            steps {
                echo 'Cleaning up old containers and images...'
                script {
                    def cleanCmd = "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} down --remove-orphans"
                    if (params.CLEAN_VOLUMES) {
                        cleanCmd = cleanCmd + " -v"
                    }
                    
                    if (isUnix()) {
                        sh "${cleanCmd} || true"
                        sh 'docker system prune -f || true'
                    } else {
                        bat "${cleanCmd} || exit 0"
                        bat 'docker system prune -f || exit 0'
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo 'Building backend Docker image...'
                        script {
                            dir('backend') {
                                if (isUnix()) {
                                    sh """
                                        docker build -t assignment27-backend:${env.GIT_COMMIT} .
                                        docker tag assignment27-backend:${env.GIT_COMMIT} assignment27-backend:latest
                                    """
                                } else {
                                    bat """
                                        docker build -t assignment27-backend:${env.GIT_COMMIT} .
                                        docker tag assignment27-backend:${env.GIT_COMMIT} assignment27-backend:latest
                                    """
                                }
                            }
                        }
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        echo 'Building frontend Docker image...'
                        script {
                            dir('frontend') {
                                if (isUnix()) {
                                    sh """
                                        docker build -t assignment27-frontend:${env.GIT_COMMIT} .
                                        docker tag assignment27-frontend:${env.GIT_COMMIT} assignment27-frontend:latest
                                    """
                                } else {
                                    bat """
                                        docker build -t assignment27-frontend:${env.GIT_COMMIT} .
                                        docker tag assignment27-frontend:${env.GIT_COMMIT} assignment27-frontend:latest
                                    """
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting containers with Docker Compose...'
                script {
                    def deployCmd = "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} up -d --build"
                    if (isUnix()) {
                        sh deployCmd
                    } else {
                        bat deployCmd
                    }
                    
                    echo 'Waiting for containers to initialize...'
                    sleep time: 15, unit: 'SECONDS'
                }
            }
        }

        stage('Health Checks') {
            parallel {
                stage('Database Health') {
                    steps {
                        echo 'Checking MongoDB connection...'
                        script {
                            def maxAttempts = 12
                            def ready = false
                            
                            for (int i = 1; i <= maxAttempts; i++) {
                                try {
                                    def result = isUnix() ?
                                        sh(script: "docker exec ${env.COMPOSE_PROJECT_NAME}_db mongosh --eval \"db.version()\" --quiet", returnStdout: true) :
                                        bat(script: "docker exec ${env.COMPOSE_PROJECT_NAME}_db mongosh --eval \"db.version()\" --quiet", returnStdout: true)
                                    
                                    echo "MongoDB is ready: ${result.trim()}"
                                    ready = true
                                    break
                                } catch (Exception e) {
                                    echo "Attempt ${i}/${maxAttempts}: Waiting for MongoDB..."
                                    sleep 5
                                }
                            }
                            
                            if (!ready) error "MongoDB failed to start"
                        }
                    }
                }
                
                stage('Backend Health') {
                    steps {
                        echo 'Checking backend API health...'
                        script {
                            def maxAttempts = 20
                            def ready = false
                            
                            for (int i = 1; i <= maxAttempts; i++) {
                                try {
                                    def statusCode
                                    if (isUnix()) {
                                        statusCode = sh(script: "${env.CURL_CMD} -s -o ${env.NULL_OUTPUT} -w \"%{http_code}\" http://localhost:5000/persons", returnStdout: true).trim()
                                    } else {
                                        statusCode = bat(script: "${env.CURL_CMD} -s -o ${env.NULL_OUTPUT} -w \"%%{http_code}\" http://localhost:5000/persons", returnStdout: true).trim()
                                    }
                                    
                                    if (statusCode == '200') {
                                        echo 'Backend API is healthy!'
                                        ready = true
                                        break
                                    }
                                } catch (Exception e) {
                                    echo "Attempt ${i}/${maxAttempts}: Backend not ready"
                                }
                                sleep 5
                            }
                            
                            if (!ready) error "Backend API failed to respond"
                        }
                    }
                }
                
                stage('Frontend Health') {
                    steps {
                        echo 'Checking frontend application...'
                        script {
                            def maxAttempts = 20
                            def ready = false
                            
                            for (int i = 1; i <= maxAttempts; i++) {
                                try {
                                    def statusCode
                                    if (isUnix()) {
                                        statusCode = sh(script: "${env.CURL_CMD} -s -o ${env.NULL_OUTPUT} -w \"%{http_code}\" http://localhost:5173", returnStdout: true).trim()
                                    } else {
                                        statusCode = bat(script: "${env.CURL_CMD} -s -o ${env.NULL_OUTPUT} -w \"%%{http_code}\" http://localhost:5173", returnStdout: true).trim()
                                    }
                                    
                                    if (statusCode == '200') {
                                        echo 'Frontend is healthy!'
                                        ready = true
                                        break
                                    }
                                } catch (Exception e) {
                                    echo "Attempt ${i}/${maxAttempts}: Frontend not ready"
                                }
                                sleep 5
                            }
                            
                            if (!ready) error "Frontend failed to respond"
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                echo 'Running relationship tests...'
                script {
                    // Test One-to-One: Person & Passport
                    echo 'Testing One-to-One Relationship (Person & Passport)...'
                    try {
                        if (isUnix()) {
                            sh '''curl -X POST http://localhost:5000/persons \
                                -H "Content-Type: application/json" \
                                -d '{"name":"Jenkins Test Person"}' '''
                            
                            sh '''curl -X POST http://localhost:5000/customers \
                                -H "Content-Type: application/json" \
                                -d '{"name":"Jenkins Customer"}' '''
                            
                            sh '''curl -X POST http://localhost:5000/actors \
                                -H "Content-Type: application/json" \
                                -d '{"name":"Jenkins Actor"}' '''
                        } else {
                            bat '''curl -X POST http://localhost:5000/persons \
                                -H "Content-Type: application/json" \
                                -d "{\\"name\\":\\"Jenkins Test Person\\"}" '''
                            
                            bat '''curl -X POST http://localhost:5000/customers \
                                -H "Content-Type: application/json" \
                                -d "{\\"name\\":\\"Jenkins Customer\\"}" '''
                            
                            bat '''curl -X POST http://localhost:5000/actors \
                                -H "Content-Type: application/json" \
                                -d "{\\"name\\":\\"Jenkins Actor\\"}" '''
                        }
                        echo 'Relationship tests completed successfully!'
                    } catch (Exception e) {
                        echo "Test failed: ${e.message}"
                        error "Relationship tests failed"
                    }
                }
            }
        }

        stage('Container Diagnostics') {
            steps {
                echo '========================================='
                echo 'Container Status'
                echo '========================================='
                script {
                    if (isUnix()) {
                        sh "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} ps"
                    } else {
                        bat "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} ps"
                    }
                }
            }
        }
    }

    post {
        success {
            echo '========================================='
            echo '✓ PIPELINE SUCCESSFUL - Assignment 27'
            echo '========================================='
            echo "Deployment Information:"
            echo "  • Environment: ${params.DEPLOY_ENV}"
            echo "  • Git Commit: ${env.GIT_COMMIT}"
            echo "  • Git Branch: ${env.GIT_BRANCH}"
            echo ''
            echo 'Application URLs:'
            echo '  • Frontend: http://localhost:5173'
            echo '  • Backend API: http://localhost:5000'
            echo '  • MongoDB: mongodb://localhost:27017'
            echo ''
            echo 'Useful Commands:'
            echo '  • View logs: docker-compose -p assignment27 logs -f'
            echo '  • Stop all: docker-compose -p assignment27 down'
            echo '========================================='
            
            script {
                if (isUnix()) {
                    sh 'docker-compose -p assignment27 logs > assignment27-logs.txt || true'
                } else {
                    bat 'docker-compose -p assignment27 logs > assignment27-logs.txt || exit 0'
                }
                archiveArtifacts artifacts: '*.txt', allowEmptyArchive: true
            }
        }
        
        failure {
            echo '========================================='
            echo '✗ PIPELINE FAILED - Assignment 27'
            echo '========================================='
            echo 'Collecting debug information...'
            
            script {
                echo 'Container Status:'
                if (isUnix()) {
                    sh "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} ps"
                    sh "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} logs --tail=100"
                } else {
                    bat "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} ps"
                    bat "${env.DOCKER_COMPOSE_CMD} -p ${env.COMPOSE_PROJECT_NAME} logs --tail=100"
                }
            }
            
            echo '========================================='
            echo 'Troubleshooting Tips:'
            echo '1. Check if ports 5000, 5173, 27017 are available'
            echo '2. Verify Docker daemon is running'
            echo '3. Check Docker Compose file syntax'
            echo '4. Review backend/frontend Dockerfiles'
            echo '========================================='
        }
        
        always {
            echo '========================================='
            echo "Pipeline completed at: ${new Date()}"
            echo '========================================='
        }
    }
}