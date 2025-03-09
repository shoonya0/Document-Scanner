document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get("docId");
  const sessionToken = localStorage.getItem("sessionToken");
  const documentId = localStorage.getItem("documentId");
  console.log(documentId);
  fetch(`http://localhost:3000/matches/${documentId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": sessionToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const matchesList = document.getElementById("matchesList");
        matchesList.innerHTML = data.matches
          .map(
            (match) =>
              `<p>${match.filename} - ${match.similarity} - ${match.id}</p>`
          )
          .join("");
      } else {
        alert("Failed to load matches: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});
