window.onload = function () {
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  }, 1500); // Delay for 1.5s to simulate loading
};

function downloadFile() {
  alert('Your file is being downloaded...');
  window.location.href = 'https://example.com/yourfile.pdf';
}
