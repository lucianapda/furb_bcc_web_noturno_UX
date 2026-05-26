// pegar elementos do HTML
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("rememberMe");

// botões da página
const btnLogin = document.getElementById("btnLogin");
const btnCadastrar = document.getElementById("btnCadastrar");

// elementos do modal de recuperação
const forgotModal = document.getElementById("forgotModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnRecover = document.getElementById("btnRecover");


// verificar se existe usuário salvo no navegador
if (localStorage.getItem("rememberUser")) {
    usernameInput.value = localStorage.getItem("rememberUser");
    rememberCheckbox.checked = true;
}


// quando clicar no botão de login
btnLogin.addEventListener("click", function () {

    // pegar o que foi digitado
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    // verificar se os campos estão vazios
    if (user === "" || pass === "") {
        alert("Preencha usuário e senha.");
        return;
    }

    // salvar usuário se lembrar-me estiver marcado
    if (rememberCheckbox.checked) {
        localStorage.setItem("rememberUser", user);
    } else {
        localStorage.removeItem("rememberUser");
    }

    // salvar usuário na sessão
    sessionStorage.setItem("loggedUser", user);

    // ir para a página principal
    window.location.href = "index.html";
});


// botão de criar conta (simulação)
btnCadastrar.addEventListener("click", function () {
    alert("Cadastro em breve!");
});


// recuperação de senha
btnRecover.addEventListener("click", function () {

    // pegar usuário digitado
    const recoverUser = document.getElementById("recoverUser").value.trim();

    // verificar se está vazio
    if (recoverUser === "") {
        alert("Digite seu usuário.");
        return;
    }

    // simulação de envio
    alert("envio do email");

    // fechar modal
    forgotModal.style.display = "none";
});


// fechar modal pelo botão
btnCloseModal.addEventListener("click", function () {
    forgotModal.style.display = "none";
});


// fechar modal clicando fora
window.addEventListener("click", function (event) {
    if (event.target === forgotModal) {
        forgotModal.style.display = "none";
    }
});