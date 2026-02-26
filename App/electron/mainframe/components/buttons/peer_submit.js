const inputField = document.getElementById('peerInput');
const submitButton = document.getElementById('peerInputSubmit');
const err_msg = document.getElementById('error-msg');

// LISTENERS
submitButton.addEventListener('click', handleSubmit);

inputField.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    handleSubmit();
  }
});

// SUBMIT
async function handleSubmit() {
  const value = inputField.value.trim();
  if (!value) return;

  errorVisual(false);

  try {
    const result = await window.electronAPI.connToPeer(value);

    if (result === 'INVALID') {
      errorVisual(true);
    }

  } catch (err) {
    console.error(err);
  }

  inputField.value = '';
}

// HELPERS
function errorVisual (error_state) {
  if (error_state) {
    err_msg.style.display = 'block';
    inputField.classList.add('error');
  }
  else {
    err_msg.style.display = 'none';
    inputField.classList.remove('error');
  }
}
