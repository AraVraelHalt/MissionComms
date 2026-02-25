from tor.tor_utils import get_secure_node
import socket
import threading
import time

HOST = "127.0.0.1"
PORT = 6000

# ----------------------------
# Global state
# ----------------------------
active_connection = None  
lock = threading.Lock() 

# ----------------------------
# Helper Functions
# ----------------------------
def validate_onion(address: str) -> bool:
    return address.endswith(".onion")

def process_message(message: str) -> str:
    message = message.strip()
    if message.startswith("JSCLIENTv1|"):
        user_input = message.split("|", 1)[1].strip()
        return "VALID" if validate_onion(user_input) else "INVALID"
    elif message.startswith("JSCLIENTv2|"):
        request = message.split("|", 1)[1].strip()
        if request == "getSecureNode":
            return get_secure_node()
        return "Unknown request"
    return message

def send_response(conn: socket.socket, response: str):
    conn.sendall(response.encode())

# ----------------------------
# Client Handler
# ----------------------------
def handle_client(conn: socket.socket, addr):
    global active_connection
    with lock:
        active_connection = conn 
    print(f"Connected to {addr}")

    try:
        while True:
            data = conn.recv(1024)
            if not data:
                print(f"Client disconnected: {addr}")
                break
            message = data.decode()
            response = process_message(message)
            send_response(conn, response)

    except Exception as e:
        print(f"Error with {addr}: {e}")

    finally:
        conn.close()
        with lock:
            active_connection = None  
        print(f"Server ready for new connections")

# ----------------------------
# Outgoing Connection
# ----------------------------
def connect_to_peer(onion_address: str, port: int, retry_delay=2, cancel_flag=None):
    """
    Try to connect to a peer repeatedly until successful or canceled.
    """
    while True:
        if cancel_flag and cancel_flag():
            print("Connection attempt canceled")
            break

        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                print(f"Attempting to connect to {onion_address}:{port}...")
                sock.connect((onion_address, port))
                print(f"Successfully connected to {onion_address}:{port}")
                global active_connection
                with lock:
                    active_connection = sock
                return sock
        except Exception as e:
            print(f"Connection failed: {e}. Retrying in {retry_delay} sec...")
            time.sleep(retry_delay)

# ----------------------------
# Server Logic
# ----------------------------
def start_server(host: str, port: int):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen()
    print(f"Listening on {host}:{port}")

    while True:
        with lock:
            if active_connection is not None:
                time.sleep(0.5)
                continue

        try:
            conn, addr = server.accept()
            threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()
        except Exception as e:
            print(f"Server accept error: {e}")

# ----------------------------
# Entry Point
# ----------------------------
if __name__ == "__main__":
    import threading

    threading.Thread(target=start_server, args=(HOST, PORT), daemon=True).start()

    cancel_flag = lambda: False  # Replace with actual UI-controlled flag

    try:
      while True: 
        time.sleep(1)
    except KeyboardInterrupt:
      print("Server stopped")
