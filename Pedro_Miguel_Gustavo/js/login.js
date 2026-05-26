    function verificarLogin(){
    var login = document.getElementById('input-id').value;
    var senha = document.getElementById('input-password').value;
    var lembrar = document.getElementById('remember').checked;

    const loginErro = document.getElementById('login-error');
    const senhaErro = document.getElementById('password-error');

    loginErro.textContent = "";
    senhaErro.textContent = "";

    let valido = true;

    if (login === "") {
        loginErro.textContent = "Preencha o login";
        valido = false;
    } else if (!login.includes("@") || !login.includes(".")) {
        loginErro.textContent = "Formato: exemplo@email.com";
        valido = false;
    }

    if (senha === "") {
        senhaErro.textContent = "Preencha a senha";
        valido = false;
    }

    if (!valido) return;

    var nome = login.split("@")[0];
    
    const usuario = {
        nome: nome,
        email: login,
        senha: senha
    };

    sessionStorage.setItem("usuario", nome);
    // salvar se checkbox marcado
    if (lembrar) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("lembrar", "true");
    } else {
        localStorage.removeItem("usuario");
        localStorage.setItem("lembrar", "false");
    }

    window.location.href='../html/home.html';
}

document.getElementById('input-id').addEventListener('input', function () {
    document.getElementById('login-error').textContent = "";
});

document.getElementById('input-password').addEventListener('input', function () {
    document.getElementById('password-error').textContent = "";
});

    window.onload = function() {
        var lembrar = localStorage.getItem("lembrar");

        if (lembrar === "true") {
            var usuario = JSON.parse(localStorage.getItem("usuario"));

            if (usuario) {
                document.getElementById("input-id").value = usuario.email;
                document.getElementById("input-password").value = usuario.senha;
                document.getElementById("remember").checked = true;
            }
        }
    }
