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
function handleSubmit() {
  const value = inputField.value.trim();
  if (!value) return;
  
  errorVisual(false); 
  
  window.electronAPI.connToPeer(value, (response) => {
    if (response === 'INVALID') {
      errorVisual(true);
    }
  });

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
