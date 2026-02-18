const { spawn } = require("child_process");
const path = require("path");

function startTor() {
  const torrcPath = path.join(__dirname, "..", "onion", "torrc");

  const torProcess = spawn("tor", ["-f", torrcPath], {
    cwd: path.join(__dirname, "..", "onion"),
});

  torProcess.stdout.on("data", (data) => {
    console.log(`[Tor] ${data}`);
  });

  torProcess.stderr.on("data", (data) => {
    console.error(`[Tor Error] ${data}`);
  });

  torProcess.on("close", (code) => {
    console.log(`Tor exited with code ${code}`);
  });

  return torProcess;
}

module.exports = startTor;

