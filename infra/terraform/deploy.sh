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

docker stop api || true
docker rm api || true
docker stop web || true
docker rm web || true
docker stop prometheus || true
docker rm prometheus || true

export POSTGRES_HOST, ECR_URL, IMAGE_TAG

docker compose up -d
