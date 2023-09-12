from http.server import BaseHTTPRequestHandler, HTTPServer
import os
from dotenv import load_dotenv

# Variables
api_server_port = 3000

load_dotenv()  # Load variables from .env file

tg_token = os.environ.get("tg_token")
print("Your IPs\n=========================")
os.system('ip a | grep 192.168')


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        message = "{}".format(tg_token)
        self.wfile.write(message.encode())


def run_server():
    server_address = ('', api_server_port)  # Use any available port
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f'API Server started on port {api_server_port}...')
    httpd.serve_forever()


run_server()
