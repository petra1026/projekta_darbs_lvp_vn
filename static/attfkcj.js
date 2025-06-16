const bootstrap = window.bootstrap

function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById("loginModal"))
        modal.show()
}

function showRegisterform() {
    document.getElementById("loginForm").style.display = "none"
    document.getElementById("registerForm").style.display = "block"
}

function showLoginForm() {
    document.getElementById("registerForm").style.display = "none"
    document.getElementById("loginForm").style.display = "block"
}

// Ielogošanās 
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });

        const data = await response.json();
        alert(data.message);

        if (data.success) {
            location.reload();
        }
    } catch (error) {
        alert("Kļūda:" + error.message);
    }
});

// Reģistrācija
document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        alert(data.message);

        if (data.success) {
            location.reload();
        }
    } catch (error) {
        alert("Kļūda:" + error.message);
    }
});

//Search funkcija
const originalContent = new Map()

function searchInPage() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim()
  const elements = document.querySelectorAll("p, li, h4, h5, h6")

  elements.forEach((el) => {
    if (!originalContent.has(el)) {
      originalContent.set(el, el.innerHTML)
    }
    el.innerHTML = originalContent.get(el)

    if (query) {
      const text = el.textContent.toLowerCase()
      if (text.includes(query)) {
        const escapedQuery = escapeRegExp(query)
        const regex = new RegExp(`(${escapedQuery})`, "gi")
        el.innerHTML = el.innerHTML.replace(regex, "<mark>$1</mark>")
      }
    }
  })
}

// Palīgfunkcija regex simbolu aizbēgšanai
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Pierakstu funckija
function saveNotes() {
    const content = document.getElementById("notesArea").value;
    localStorage.setItem("userNotes", content);
    alert("Pieraksti saglabāti!");
}

//Ielādē saglabātos pierakstus
window.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("notesArea");
    if (textarea) {
        const saved = localStorage.getItem("userNotes");
        if (saved) {
            textarea.value = saved;
        }
    }
});

// Notīra meklēšanas rezultātus, kad lietotājs atstāj lapu
window.addEventListener("beforeunload", () => {
  const searchInput = document.getElementById("searchInput")
  if (searchInput && originalContent.size > 0) {
    searchInput.value = ""
    // Atjauno oriģinālo saturu
    originalContent.forEach((originalHTML, element) => {
      element.innerHTML = originalHTML
    })
  }
})