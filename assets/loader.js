// loader.js

// Inject loader HTML into body
document.addEventListener("DOMContentLoaded", () => {
  const loaderHTML = `
    <style>
      #page-loader {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: white;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.3s ease;
      }
      .spinner {
        border: 6px solid #eee;
        border-top: 6px solid #007bff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
    <div id="page-loader">
      <div class="spinner"></div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", loaderHTML);
});

// Remove loader when page fully loaded
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300); // smooth hide
  }
});
