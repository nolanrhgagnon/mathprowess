#!/bin/bash
set -e

IMAGE_TAG="$1"

# These must already be set in the environment
# or you can hardcode them here
ACCOUNT_ID="${account_id}"
REGION="ap-northeast-1"
POSTGRES_HOST="${postgres_host}"

ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$ECR_URL"

docker pull "$ECR_URL/mp-api:$IMAGE_TAG"
docker pull "$ECR_URL/mp-web:$IMAGE_TAG"

docker stop api || true
docker rm api || true
docker stop web || true
docker rm web || true

docker run -d --restart unless-stopped \
  --name api \
  --network prowess-network \
  -e POSTGRES_DB=prowessdb \
  -e POSTGRES_USER=appuser \
  -e POSTGRES_PASSWORD=supersecurepassword \
  -e POSTGRES_HOST="$POSTGRES_HOST" \
  -e POSTGRES_PORT=5432 \
  -e ALLOWED_HOSTS="app-alb-1194072423.ap-northeast-1.elb.amazonaws.com,mathprowess.com" \
  "$ECR_URL/mp-api:$IMAGE_TAG"

docker run -d --restart unless-stopped \
  --name web \
  --network prowess-network \
  -p 80:80 \
  "$ECR_URL/mp-web:$IMAGE_TAG"
