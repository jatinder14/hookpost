#!/bin/bash

set -o xtrace

docker rmi localhost/hookpost || true
docker build --target dist -t localhost/hookpost -f Dockerfile.dev .
docker build --target devcontainer -t localhost/hookpost-devcontainer -f Dockerfile.dev .
