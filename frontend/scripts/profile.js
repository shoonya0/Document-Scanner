let requestId;
document.addEventListener("DOMContentLoaded", function () {
  const sessionToken = localStorage.getItem("sessionToken");
  fetch("http://localhost:3000/user/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": sessionToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        const profileInfo = document.getElementById("profileInfo");
        profileInfo.innerHTML = `
                <p>Username: ${data.user.username}</p>
                <p>Credits: ${data.user.credits}</p>
            `;
        requestId = data.user.id;
      } else {
        alert("Failed to load profile: " + data);
      }
    })
    .catch((error) => console.error("Error:", error));
});

// if button is clicked, send a request to the admin to approve the credit request
document
  .getElementById("approveCreditRequest")
  .addEventListener("click", function () {
    const sessionToken = localStorage.getItem("sessionToken");
    fetch("http://localhost:3000/credits/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": sessionToken,
      },
      body: JSON.stringify({
        requestId: requestId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => console.error("Error:", error));
  });

// for scan document button
document.getElementById("scanDocument").addEventListener("click", function () {
  const sessionToken = localStorage.getItem("sessionToken");
  fetch("http://localhost:3000/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": sessionToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => console.error("Error:", error));
});

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
          localStorage.setItem("documentId", data.documentId);
        } else {
          alert("Upload failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
