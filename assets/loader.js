// sylheti-loader.js

document.addEventListener("DOMContentLoaded", () => {
  const loaderHTML = `
    <style>
      /* Sylheti Smart Loader - No Conflict */
      #sylheti-kamil-loader {
        position: fixed;
        inset: 0;
        background: #ffffff;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Noto Sans Bengali', sans-serif;
      }
      .sylheti-dot-box {
        display: flex;
        gap: 12px;
        position: relative;
      }
      .sylheti-dot {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #1877f2;
        opacity: 0.5;
        animation: sylheti-bounce 1.2s infinite;
      }
      .sylheti-dot:nth-child(1) { animation-delay: 0s; }
      .sylheti-dot:nth-child(2) { animation-delay: 0.2s; }
      .sylheti-dot:nth-child(3) { animation-delay: 0.4s; }
      .sylheti-dot:nth-child(4) { animation-delay: 0.6s; }

      @keyframes sylheti-bounce {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-10px); opacity: 1; }
      }
    </style>

    <div id="sylheti-kamil-loader">
      <div class="sylheti-dot-box">
        <div class="sylheti-dot"></div>
        <div class="sylheti-dot"></div>
        <div class="sylheti-dot"></div>
        <div class="sylheti-dot"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", loaderHTML);
});

window.addEventListener("load", () => {
  const loader = document.getElementById("sylheti-kamil-loader");
  if (loader) {
    loader.style.transition = 'opacity 0.4s ease';
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 400);
  }
});
