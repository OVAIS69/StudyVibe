document.getElementById("pdfUpload").addEventListener("change", function () {
  const file = this.files[0];
  const loader = document.getElementById("loader");
  const output = document.getElementById("output");
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfText = document.getElementById("pdfText");

  if (!file) return;

  loader.classList.remove("hidden");
  output.textContent = "";
  pdfViewer.classList.add("hidden");
  pdfText.textContent = "Extracting text...";

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
        let fullText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          fullText += pageText + "\n\n";
        }
        pdfText.textContent = fullText.trim() || "⚠ No text found in PDF.";
      });
    };
    reader.readAsArrayBuffer(file);
  }, 1500);
});
