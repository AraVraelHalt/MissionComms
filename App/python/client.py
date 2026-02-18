import socks
import socket

s = socks.socksocket()
s.set_proxy(socks.SOCKS5, "127.0.0.1", 9050)

try:
    s.connect(("iklo4xrurtstonzpjujiyai2ikggau7xd4sx762v7mowlggbu5hqnfad.onion", 80))
    s.sendall(b"Hello Tor Server")
    data = s.recv(1024)
    print("Received:", data.decode())

finally:
    s.close()

