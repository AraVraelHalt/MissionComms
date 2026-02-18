import socket

HOST = "127.0.0.1"
PORT = 6000

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen()

print(f"Listening on {HOST}:{PORT}")

while True:
    conn, addr = server.accept()
    print("Connected by", addr)
    
    try:
        data = conn.recv(1024)
        if not data:
            continue
    
        print("Received:", data.decode())
        conn.sendall(b"Message received")
    
    finally:
        conn.close()

