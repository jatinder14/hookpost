#!/usr/bin/env bash

docker kill hookpost || true 
docker rm hookpost || true 
docker create --name hookpost -p 3000:3000 -p 4200:4200 localhost/hookpost
