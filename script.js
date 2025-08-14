document.getElementById("pdfUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type === "application/pdf") {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const typedarray = new Uint8Array(this.result);

      pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
        const viewer = document.getElementById("pdfViewer");
        viewer.innerHTML = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          pdf.getPage(pageNum).then(function (page) {
            const canvas = document.createElement("canvas");
            viewer.appendChild(canvas);
            const context = canvas.getContext("2d");
            const viewport = page.getViewport({ scale: 1.2 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: context, viewport: viewport });
          });
        }
      });
    };
    fileReader.readAsArrayBuffer(file);
  } else {
    alert("Please upload a valid PDF file.");
  }
});
