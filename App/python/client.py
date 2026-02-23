from pathlib import Path
import socks
import socket

addr = Path("../onion/hidden_service/hostname").read_text().strip()

s = socks.socksocket()
s.set_proxy(socks.SOCKS5, "127.0.0.1", 9050)

try:
    s.connect((addr, 80))
    s.sendall(b"Hello Tor Server")

finally:
    s.close()

