const cancel_btn = document.getElementById('cancel-btn');

cancel_btn.addEventListener('click', () => {
  window.electronAPI.cancelPeerConn();
});
