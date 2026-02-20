let hoppingInterval;

window.electronAPI.onPythonOutput((event, data) => {
  console.log(data); // for debugging
});

window.electronAPI.onTorDone(() => {
  clearInterval(hoppingInterval);
});

function startHopping() {
  hoppingInterval = setInterval(() => {
    const randomIP = Array(4)
      .fill(0)
      .map(() => Math.floor(Math.random() * 256))
      .join('.');
    const statusEl = document.getElementById('status');
    statusEl.innerText += `Hopping to ${randomIP}\n`;
  }, 200);
}

startHopping();

