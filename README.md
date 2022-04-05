# NodeJs/K8S

# 1. Docker Image

1. ```docker build -t yzhbankov/node-app .``` - build image
2. ```docker login``` - run database migrations to add tables
3. ```docker push -t yzhbankov/node-app:latest``` - run ui

# 2. K8S

1. ```kubectl get deployment``` - list of deployments
2. ```kubectl delete deployment node-app-deployment``` - delete deployment
3. ```kubectl apply -f k8s/node-app.yaml``` - create/update deployment/service
4. ```kubectl apply -f k8s/node-app-ingress.yaml``` - create/update ingress