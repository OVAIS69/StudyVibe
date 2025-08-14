let extractedText = "";

document.getElementById("pdfUpload").addEventListener("change", function () {
  const file = this.files[0];
  const loader = document.getElementById("loader");
  const output = document.getElementById("output");
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfText = document.getElementById("pdfText");
  const searchBox = document.querySelector(".search-box");

  if (!file) return;

  loader.classList.remove("hidden");
  output.textContent = "";
  pdfViewer.classList.add("hidden");
  pdfText.textContent = "Extracting text...";
  searchBox.classList.add("hidden");

  const fileURL = URL.createObjectURL(file);

  setTimeout(() => {
    loader.classList.add("hidden");
    output.textContent = `✅ Loaded: ${file.name}`;

    // Show PDF preview
    pdfViewer.src = fileURL;
    pdfViewer.classList.remove("hidden");

    // Extract text using PDF.js
    const reader = new FileReader();
    reader.onload = function () {
      const typedarray = new Uint8Array(this.result);

      pdfjsLib.getDocument(typedarray).promise.then(async function (pdf) {
        extractedText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          extractedText += pageText + "\n\n";
        }
        pdfText.textContent = extractedText.trim() || "⚠ No text found in PDF.";
        searchBox.classList.remove("hidden");
      });
    };
    reader.readAsArrayBuffer(file);
  }, 1500);
});

// 🔍 Search Function
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.trim();
  const pdfText = document.getElementById("pdfText");

  if (!query) {
    pdfText.innerHTML = extractedText;
    return;
  }

  const regex = new RegExp(`(${query})`, "gi");
  pdfText.innerHTML = extractedText.replace(regex, "<mark>$1</mark>");
});

// 💡 Ask AI Button (placeholder simulation)
document.getElementById("askAI").addEventListener("click", function () {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Enter something in the search box first!");
    return;
  }
  alert(`🤖 Gemini would now analyze: "${query}"\n(We'll connect real AI in Phase 4)`);
});
