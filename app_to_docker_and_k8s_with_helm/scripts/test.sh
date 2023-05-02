#!/bin/bash
## Test your deployment
kubectl get pods -n myns

kubectl -n myns port-forward service/api 3000:3000 &
curl http://localhost:3000/hello
