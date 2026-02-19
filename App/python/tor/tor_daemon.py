import subprocess
import os

def start_tor():
    tor_exec = "tor"
    script_dir = os.path.dirname(os.path.abspath(__file__))
    onion_dir = os.path.abspath(os.path.join(script_dir, "../../onion"))

    process = subprocess.Popen(
        [tor_exec, "-f", "torrc"],
        cwd=onion_dir,
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
