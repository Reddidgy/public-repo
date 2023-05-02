#!/bin/bash

#minikube start

NAMESPACE="myns"
kubectl create namespace $NAMESPACE

## TODO: Docker build and push
## NOTE: I didn't use push to avoid creating local docker registry for this task
## Instead of this I've used loading docker image to minikub's docker daemon with "eval" below
docker build -t myns:latest -f docker/Dockerfile .

# Load Docker image into Minikube's Docker daemon
# Instead of push image to proper registry and proper version we're loading it to minikube docker-env for using in cluster
# it's not secure to use eval if you're trying to use some script as source. But here that's fine and not bad practice in this case
docker save myns:latest | (eval $(minikube docker-env) && docker load)

# ## TODO: Deploy k8s manifests (with helm)
helm install api api-chart/ -n $NAMESPACE

echo "============= FINISHED ================="
echo "Resources are creating.. It can take around 10-20 seconds"
echo "Please use scripts/test.sh to check connection"