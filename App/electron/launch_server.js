const { spawn } = require("child_process");
const path = require("path");

function startServer() {
  const serverPath = path.join(__dirname, "..", "python", "server.py");

  const serverProcess = spawn("python3", [serverPath]);

  serverProcess.stdout.on("data", (data) => {
    console.log(`[Server] ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`[Server Error] ${data}`);
  });

  serverProcess.on("close", (code) => {
    console.log(`Server exited with code ${code}`);
  });

  return serverProcess;
}

module.exports = startServer;

