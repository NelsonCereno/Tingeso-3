pipeline {
    agent any
    tools{
        maven 'maven'
    }
    stages{
        stage('Build JAR File'){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/NelsonCereno/Tingeso-1']])
                dir("payroll-backend"){
                bat "mvn clean install"
                }
            }
        }

        stage("Unit Tests") {
            steps {
                // Run Maven 'test' phase. It compiles the test sources and runs the unit tests
                dir("payroll-backend"){
                bat "mvn test" // Use 'bat' for Windows agents or 'sh' for Unix/Linux agents
                }
            }
        }

        stage("Build and Push Docker Image"){
            steps{
                dir("payroll-backend"){
                    script{
                        withDockerRegistry(credentialsId: 'docker-credentials'){
                            bat "docker build -t nelsoncereno/payroll-backend ."
                            bat "docker push nelsoncereno/payroll-backend"
                        }
                    }
                }
            }
        }
    }   
}