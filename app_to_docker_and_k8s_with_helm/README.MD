## What is it?

Dockerized application using k8s, helm, written Dockerfile with multistage instance using scratch.

More information about task you can find in `TASK_DESCRIPTION.MD`

## Requirements to build and deploy

- minikube
- kubectl
- helm
- docker (with user in docker group)

## To start
`scripts/deploy.sh`

## To clean (if needed)
`scripts/clean.sh`

## To test
`scripts/test.sh`
