const sn = document.getElementById('secure-node');
const un = document.getElementById('username');

document.addEventListener('DOMContentLoaded', async () => {

  try {
    const secureNode = await window.electronAPI.getSecureNode();

    // Update
    sn.textContent = `Secure Node: ${secureNode.nickname} (${secureNode.country})`;
  } 
  catch (err) {
    console.error('Failed to get Secure Node:', err);
    sn.textContent = 'Secure Node: Unavailable';
  }
});
