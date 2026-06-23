#!/bin/bash
# health-check.sh - Verify NexusTech is running on port 7788

echo "=========================================="
echo "  NexusTech Health Check - Port 7788"
echo "=========================================="

echo ""
echo "Checking frontend..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:7788/ > /dev/null 2>&1; then
  echo "  Frontend: http://localhost:7788  OK"
else
  echo "  Frontend: http://localhost:7788  FAIL"
fi

echo ""
echo "Checking backend API..."
HEALTH=$(curl -s http://localhost:7788/api/health 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "  Backend API: http://localhost:7788/api/health  OK"
  echo "  Response: $HEALTH"
else
  echo "  Backend API: http://localhost:7788/api/health  FAIL"
fi

echo ""
echo "Checking MongoDB..."
if docker ps 2>/dev/null | grep nexus-mongo > /dev/null; then
  echo "  MongoDB (port 27018):  OK"
else
  echo "  MongoDB (port 27018):  NOT RUNNING"
fi

echo ""
echo "=========================================="
echo "  Application URL: http://localhost:7788"
echo "  Admin Panel:     http://localhost:7788/admin"
echo "  API Health:      http://localhost:7788/api/health"
echo "=========================================="
