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
document.getElementById("registerForm").addEventListener("submit", async function (e) {
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
function searchInPage() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const elements = document.querySelectorAll("p, li, h4, h5, h6");

    elements.forEach(el => {
        // Atjauno sākotnējo saturu
        const original = el.textContent;
        el.innerHTML = original.replace(
            new RegExp(`(${query})`, 'gi'),
            '<mark>$1</mark>'
        );
    });
}
