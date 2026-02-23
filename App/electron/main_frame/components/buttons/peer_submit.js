const inputField = document.getElementById('peerInput');
const submitButton = document.getElementById('peerInputSubmit');

// LISTENERS
submitButton.addEventListener('click', handleSubmit);

inputField.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    handleSubmit();
  }
});

// SUBMIT
function handleSubmit() {
  const value = inputField.value.trim();
  if (!value) return;

  window.electronAPI.sendToServer(value, (response) => {
    // Change this later
    alert(response);
  });

  inputField.value = '';
}
