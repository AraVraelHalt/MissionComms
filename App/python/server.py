from tor.tor_utils import get_secure_node
import socket

HOST = "127.0.0.1"
PORT = 6000

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen()

print(f"Listening on {HOST}:{PORT}")

while True:
  conn, addr = server.accept()
    
  try:
    while True: 
      data = conn.recv(1024)
      if not data:
        print("Client disconnected", addr)
        break 
    
      message = data.decode().strip()

      # IPC Check
      if message.startswith("JSCLIENTv1|"):
        user_input = message.split("|", 1)[1]

        if user_input == "getSecureNode":
          response = get_secure_node()
          conn.sendall(response.encode())
        elif user_input.endswith(".onion"):
          conn.sendall(b"Valid onion address")
        else:
          conn.sendall(b"Invalid address")
      
      else:
        conn.sendall(b"Received your message")

  except Exception as e:
    print("Error:", e)

  finally:
    conn.close()
