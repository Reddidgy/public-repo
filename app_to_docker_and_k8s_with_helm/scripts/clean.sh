#!/bin/bash
eval $(minikube docker-env -u)

kubectl config use-context minikube

# helm deleting
if helm status api >/dev/null 2>&1; then
    echo "Uninstalling api release..."
    helm uninstall api
else
    echo "Release api already deleted"
fi

# myns image deleting
if docker rmi myns 2> /dev/null; then
    :
else
    echo "Image myns already deleted"
fi

# myns image deleting
if kubectl delete namespace myns 2> /dev/null; then
    :
else
    echo "Namespace myns is already deleted"
fi






