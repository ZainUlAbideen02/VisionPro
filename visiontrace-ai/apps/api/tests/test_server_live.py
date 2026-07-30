import os
import sys
import time
import requests

# Ensure app module path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def test_fastapi_endpoints():
    print("=======================================================")
    print(" VisionTrace AI — Automated End-to-End API Test Suite ")
    print("=======================================================")

    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)

    # 1. Test Root Endpoint
    resp_root = client.get("/")
    print(f"[✔] Root GET Status: {resp_root.status_code} -> {resp_root.json()}")
    assert resp_root.status_code == 200

    # 2. Test Analytics Endpoint
    resp_analytics = client.get("/api/v1/analytics")
    print(f"[✔] Analytics GET Status: {resp_analytics.status_code} -> {resp_analytics.json()}")
    assert resp_analytics.status_code == 200

    # 3. Test Search Endpoint with natural language query
    search_payload = {
        "query": "Show me when the server terminal turned red",
        "limit": 5
    }
    resp_search = client.post("/api/v1/search", json=search_payload)
    print(f"[✔] Search POST Status: {resp_search.status_code}")
    print(f"    Search Query: '{resp_search.json().get('query')}'")
    print(f"    Returned Results Count: {resp_search.json().get('results_count')}")
    assert resp_search.status_code == 200

    print("\n[SUCCESS] All End-to-End FastApi Routes & Services Verified Autonomously!")

if __name__ == "__main__":
    test_fastapi_endpoints()
