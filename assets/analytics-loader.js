// analytics-loader.js
(function(){
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-T2S2MZJJEQ';
  document.head.appendChild(gaScript);

  const inlineScript = document.createElement('script');
  inlineScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-T2S2MZJJEQ');
  `;
  document.head.appendChild(inlineScript);
})();