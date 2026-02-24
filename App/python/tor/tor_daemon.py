import subprocess
import os

TOR_EXEC = "tor"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ONION_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../onion"))

def start_tor():
    process = subprocess.Popen(
        [TOR_EXEC, "-f", "torrc"],
        cwd=ONION_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        start_new_session=True
    )

    print(f"__TOR_PID__:{process.pid}", flush=True)
    
    for line in process.stdout:
        print(line, flush=True)    

if __name__ == "__main__":
    start_tor()
