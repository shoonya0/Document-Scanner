document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const documentFile = document.getElementById("document").files[0];
    const file = new FormData();
    file.append("document", documentFile);
    const sessionToken = localStorage.getItem("sessionToken");

    fetch("http://localhost:3000/scanUpload", {
      method: "POST",
      body: file,
      headers: {
        "x-access-token": sessionToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Document uploaded successfully!");
          window.location.href = `matches.html?docId=${data.documentId}`;
        } else {
          alert("Upload failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
