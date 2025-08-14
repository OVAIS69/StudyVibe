document.getElementById("pdfUpload").addEventListener("change", function () {
  const file = this.files[0];
  const loader = document.getElementById("loader");
  const output = document.getElementById("output");

  if (!file) return;

  loader.classList.remove("hidden");
  output.textContent = "";

  // Simulate loading time
  setTimeout(() => {
    loader.classList.add("hidden");
    output.textContent = `✅ Loaded: ${file.name}`;
  }, 1500);
});
