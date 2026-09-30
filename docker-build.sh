#!/bin/bash

echo "🚀 Building Relay..."

# Build the web app
echo "🚀 Building Web App ..."
docker build -f apps/web/Dockerfile . -t saas-ai-support-platform-web

# Build the widget app
echo "🚀 Building Widget App ..."
docker build -f apps/widget/Dockerfile . -t saas-ai-support-platform-widget

echo "✅ Build ... Done"

