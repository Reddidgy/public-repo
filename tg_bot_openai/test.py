import requests

# The IP address and port of your local machine
LOCAL_IP = "127.0.0.1"
LOCAL_PORT = 5000

# Start a local web server to receive the requests from Charles
def start_server():
    # Use the Flask library to create a simple REST API
    from flask import Flask, request
    app = Flask(__name__)

    @app.route("/", methods=["GET", "POST"])
    def handle_request():
        # Log the request information
        print("Received request:")
        print("Method:", request.method)
        print("Headers:", request.headers)
        print("Body:", request.data)

        # Modify the request as needed
        modified_request = request

        # Forward the request to the original destination
        response = requests.request(modified_request.method, modified_request.url, headers=modified_request.headers, data=modified_request.data)

        # Log the response information
        print("Received response:")
        print("Status code:", response.status_code)
        print("Headers:", response.headers)
        print("Body:", response.text)

        # Modify the response as needed
        modified_response = response

        # Return the modified response
        return modified_response.text, modified_response.status_code

    # Start the Flask app
    app.run(host=LOCAL_IP, port=LOCAL_PORT)

# Start the server when the script is run
if __name__ == "__main__":
    start_server()
