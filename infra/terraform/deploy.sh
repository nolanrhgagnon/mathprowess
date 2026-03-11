#!/bin/bash
set -e

IMAGE_TAG="$1"

ACCOUNT_ID="${account_id}"
REGION="ap-northeast-1"
POSTGRES_HOST="${postgres_host}"

ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$ECR_URL"

docker pull "$ECR_URL/mp-api:$IMAGE_TAG"
docker pull "$ECR_URL/mp-web:$IMAGE_TAG"
docker pull "$ECR_URL/mp-prom:$IMAGE_TAG"

docker compose -f ./prod-docker-compose.yaml down

export POSTGRES_HOST=$POSTGRES_HOST
export ECR_URL=$ECR_URL
export IMAGE_TAG=$IMAGE_TAG

docker compose -f ./prod-docker-compose.yaml up -d
