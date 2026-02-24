from stem.control import Controller
from stem import CircStatus
import geoip2.database
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GEOIP_DB_PATH = os.path.join(BASE_DIR, "assets/GeoLite2-Country.mmdb")
TOR_CONTROL_PORT = 9051

"""
Returns name and country of the exit node
from the first built Tor circuit
"""
def get_secure_node():
    try:
        reader = geoip2.database.Reader(GEOIP_DB_PATH)

        with Controller.from_port(port=TOR_CONTROL_PORT) as controller:
            # Authenticate
            controller.authenticate(password="mypassword")

            circuits = controller.get_circuits()

            for circ in circuits:
                if circ.status == CircStatus.BUILT:
                    exit_fingerprint, exit_nickname = circ.path[-1]
                    exit_router = controller.get_network_status(exit_fingerprint)
                    exit_ip = exit_router.address

                    try:
                        country = reader.country(exit_ip).country.name
                    except Exception:
                        country = "Unknown"

                    return json.dumps({
                        "nickname": exit_nickname,
                        "country": country
                    })

            return json.dumps({"error": "No built circuit found"})

    except Exception as e:
        print("Tor fetch error:", e)
        return json.dumps({"error": str(e)})
