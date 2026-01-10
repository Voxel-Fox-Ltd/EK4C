const api = globalThis.browser ?? globalThis.chrome;

document.getElementById("openOptions").addEventListener("click", async () => {
  // Works in Firefox and Chrome
  await api.runtime.openOptionsPage();
  window.close();
});
