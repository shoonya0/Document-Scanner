document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful") {
          // store the session token in the local storage
          storeSessionToken(data.token);
          // redirect to the profile page if it's regular user or admin page if it's admin
          if (data.user.role === "admin") window.location.href = "admin.html";
          else window.location.href = "profile.html";
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });

// Store session token after successful login
function storeSessionToken(token) {
  localStorage.setItem("sessionToken", token);
}

// Retrieve session token
function getSessionToken() {
  return localStorage.getItem("sessionToken");
}

// Clear session token on logout
function clearSessionToken() {
  localStorage.removeItem("sessionToken");
}
