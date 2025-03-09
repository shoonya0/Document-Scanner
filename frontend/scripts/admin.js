document.addEventListener("DOMContentLoaded", function () {
  // get the analytics data
  // token is in the local <storage></storage>
  const token = localStorage.getItem("sessionToken");
  fetch("http://localhost:3000/admin/analytics", {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const analyticsData = document.getElementById("analyticsData");
        analyticsData.innerHTML = `
                <p>Total Scans: ${data.totalScans}</p>
                <p>Top Users: ${data.topUsers.join(", ")}</p>
                <p>Common Topics: ${data.commonTopics.join(", ")}</p>
            `;
        const users = document.getElementById("users");
        users.innerHTML = `
                <p>Users: ${data.users.join(", ")}</p>
            `;
        const documents = document.getElementById("documents");
        documents.innerHTML = `
                <p>Documents: ${data.documents.join(", ")}</p>
            `;
        const creditRequests = document.getElementById("creditRequests");
        creditRequests.innerHTML = `
                <p>Credit Requests: ${data.creditRequests.join(", ")}</p>
            `;
      } else {
        alert("Failed to load analytics: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});
