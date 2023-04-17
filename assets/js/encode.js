
  const seed = "PromtBros 2023";  
  const encoderForm = document.getElementById("encoder-form");
  const urlInput = document.getElementById("url-input");
  const encodedUrlInput = document.getElementById("encoded-url");
  const copyButton = document.getElementById("copy-button");
  
  document.getElementById("encoder-form").addEventListener("submit", (event) => {
    event.preventDefault();
  
    const url = document.getElementById("url-input").value;
    const encodedUrl = xorEncode(url, seed);
    const result = document.getElementById("encoded-url");
    result.value = encodedUrl;
  
    const currentUrl = window.location.href;
    const newUrl = currentUrl.split("?")[0] + "?data=" + encodedUrl;
    history.pushState(null, null, newUrl);
  });
  
  copyButton.addEventListener("click", () => {
    encodedUrlInput.select();
    document.execCommand("copy");
    alert("Encoded URL copied to clipboard!");
  });
  
  function xorEncode(str, seed) {
    let result = "";
  
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ seed.charCodeAt(i % seed.length));
    }
  
    const base64 = btoa(result);
    const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
  
    return encodeURIComponent(urlSafeBase64);
  }
  
  