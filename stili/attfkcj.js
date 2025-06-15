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
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                location.reload();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Kļūda: " + error.message);
        }
    });
});

// Reģistrācija
document.getElementById("registerForm").addEventListener("submit", async (e)) ;{
    e.preventDefault()

    const username = document.getElementById("regUsername").value 
    const password = document.getElementById("regPassword").value 

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
        })
        
        const data = await response.json()
        alert(data.message)

        if (data.success) {
            showLoginForm()
        } 
        } catch (error){
            alert("Kļūda:" + error.message)
        }
    }