from tor.tor_utils import get_secure_node
import socket
import threading
import time
import socks

HOST = "127.0.0.1"
PORT = 6000

# ----------------------------
# Global State
# ----------------------------
server_running = True
peer_connection = None
peer_lock = threading.Lock()
peer_connecting = False
peer_cancel_requested = False

# ----------------------------
# Helper Functions
# ----------------------------
def validate_onion(address: str) -> bool:
    return address.endswith(".onion")

def send_response(conn: socket.socket, response: str):
    conn.sendall(response.encode())

# ----------------------------
# Peer Connection Logic (Tor)
# ----------------------------
def connect_to_peer(onion_address: str, port: int, retry_delay=5):
    global peer_connection, peer_connecting, peer_cancel_requested

    with peer_lock:
        if peer_connecting or peer_connection:
            print("Peer connection already active or connecting")
            return
        peer_connecting = True
        peer_cancel_requested = False

    print(f"[TOR] Starting connection to {onion_address}:{port}")

    while True:
        with peer_lock:
            if peer_cancel_requested:
                print("[TOR] Connection attempt cancelled")
                peer_connecting = False
                return

        try:
            sock = socks.socksocket()
            sock.set_proxy(socks.SOCKS5, "127.0.0.1", 9050)

            sock.connect((onion_address, port))

            print(f"[TOR] Successfully connected...")

            with peer_lock:
                peer_connection = sock
                peer_connecting = False
                print("EVENT:CONNECTED", flush=True)

            handle_peer(sock)
            break

        except Exception as e:
            print(f"[TOR] Connection failed: {e}")
            time.sleep(retry_delay)

def handle_peer(sock: socket.socket):
    global peer_connection

    try:
        while True:
            data = sock.recv(1024)
            if not data:
                break

            message = data.decode().strip()
            print(f"[PEER MESSAGE] {message}")

    except Exception as e:
        print(f"[PEER ERROR] {e}")

    finally:
        print("[TOR] Peer disconnected")
        with peer_lock:
            peer_connection = None
        sock.close()

# ----------------------------
# Message Processing
# ----------------------------
def process_message(message: str) -> str:
    message = message.strip()

    if message.startswith("JSCLIENTv1|"):
        user_input = message.split("|", 1)[1].strip()

        if validate_onion(user_input):
            threading.Thread(
                target=connect_to_peer,
                args=(user_input, 80),
                daemon=True
            ).start()

            return "VALID"

        return "INVALID"

    elif message.startswith("JSCLIENTv2|"):
        request = message.split("|", 1)[1].strip()

        if request == "getSecureNode":
            return get_secure_node()
        elif request == "cancelPeerConn":
            global peer_cancel_requested, peer_connection, peer_connecting
            
            with peer_lock:
                peer_cancel_requested = True
                peer_connecting = False
            
                if peer_connection:
                    try:
                        peer_connection.close()
                    except:
                        pass
                    peer_connection = None

            return "CONN CANCELLED"

        return "Unknown request"

    return "Unknown command"

# ----------------------------
# Client Handler
# ----------------------------
def handle_client(conn: socket.socket, addr):
    print(f"[SERVER] Connected: {addr}")

    try:
        data = conn.recv(1024)
        if not data:
            return

        message = data.decode()
        response = process_message(message)
        send_response(conn, response)

    except Exception as e:
        print(f"[SERVER ERROR] {e}")

    finally:
        conn.close()
        print(f"[SERVER] Disconnected: {addr}")

# ----------------------------
# Server
# ----------------------------
def start_server(host: str, port: int):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen()

    print(f"[SERVER] Listening on {host}:{port}")

    while server_running:
        try:
            conn, addr = server.accept()
            threading.Thread(
                target=handle_client,
                args=(conn, addr),
                daemon=True
            ).start()

        except Exception as e:
            print(f"[SERVER ACCEPT ERROR] {e}")

# ----------------------------
# Entry Point
# ----------------------------
if __name__ == "__main__":
    threading.Thread(
        target=start_server,
        args=(HOST, PORT),
        daemon=True
    ).start()

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("Server shutting down...")
        server_running = False
