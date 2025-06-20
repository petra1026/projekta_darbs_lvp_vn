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

    console.log("=== LOGIN MĒĢINĀJUMS ===")

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log(`Lietotājvārds: '${username}', Parole garums: ${password.length}`)

    if (!username || !password) {
    alert("Lūdzu ievadiet gan lietotājvārdu, gan paroli!")
    return
    }

    try {
        console.log("Sūta pieprasījumu uz serveri...")

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });

        console.log(`Response status: ${response.status}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json();
        console.log("Saņemta atbilde:", data)
        alert(data.message);

        if (data.success) {
            console.log("Login veiksmīgs, pārlādē lapu...")
            location.reload();
        }
    } catch (error) {
        console.error("Login kļūda:", error)
        alert("Kļūda:" + error.message);
    }
});

// Reģistrācija
document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("=== REĢISTRĀCIJAS MĒĢINĀJUMS ===")

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    console.log(`Reģistrē: '${username}', Parole garums: ${password.length}`)

    if (!username || !password) {
        alert("Lūdzu ievadiet gan lietotājvārdu, gan paroli!")
        return
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Reģistrācijas atbilde:", data)
        alert(data.message);

        if (data.success) {
            showLoginForm();
        }
    } catch (error) {
        console.error("Reģistrācijas kļūda:", error)
        alert("Kļūda:" + error.message);
    }
});

//Search funkcija
const originalContent = new Map()

function searchInPage() {
  const searchInput = document.getElementById("searchInput")
  if (!searchInput) {
    console.log("Search input nav atrasts") 
    return
  }

  const query = searchInput.value.toLowerCase().trim()
  const elements = document.querySelectorAll("p, li, h4, h5, h6")

  console.log(`Meklē: '${query}', Elementi: ${elements.length}`) 

  elements.forEach((el) => {
    // Saglabā oriģinālo saturu
    if (!originalContent.has(el)) {
      originalContent.set(el, el.innerHTML)
    }

    // Atjauno oriģinālo saturu
    el.innerHTML = originalContent.get(el)

    // Izceļ tekstu
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
  const textarea = document.getElementById("notesArea")
  if (!textarea) {
    console.log("Textarea nav atrasta") 
    alert("Kļūda: Nevar atrast pierakstu lauku!")
    return
  }

  const content = textarea.value
  console.log(`Saglabā pierakstus: ${content.length} simboli`) 

  localStorage.setItem("userNotes", content)
  alert("Pieraksti saglabāti!")
}

//Ielādē saglabātos pierakstus
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ielādēts") 

  const textarea = document.getElementById("notesArea")
  if (textarea) {
    const saved = localStorage.getItem("userNotes")
    if (saved) {
      textarea.value = saved
      console.log(`Ielādēti pieraksti: ${saved.length} simboli`) 
    }
  }
})

//Sesijas pārbaude
async function checkSession() {
  try {
    const response = await fetch("/check_session")
    const data = await response.json()
    console.log("Session status:", data)
    return data.logged_in
  } catch (error) {
    console.error("Session check error:", error)
    return false
  }
}

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