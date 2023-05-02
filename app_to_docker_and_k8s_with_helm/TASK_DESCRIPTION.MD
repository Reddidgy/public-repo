Description

The scope of this exercise is to deploy a Go web application in a local Kubernetes cluster.

The candidate should
- Dockerize the application
- Write the k8s manifests for deployment
- Deploy the app in the k8s cluster
- Test the deployment with the “test.sh” commands

Deliverables
- The Dockerfile
- The k8s manifests (preferably helm charts)
- A script that deploys 3 instances of the app to a local k8s cluster
- The app should be deployed in the k8s namespace “myns”
- The service name should be “api”
- The application listens on port 8080
- The service should listen on port 3000

Notes

- The command to compile the go application is the following: `CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o api main.go
- You can use any tool for the k8s cluster (e.g. kind, minikube, k3d)
- Create a GitHub repository and share the solution with the account: ****@***** :)
- Have fun