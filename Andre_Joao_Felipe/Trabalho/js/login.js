//JAVASCRIPT DO LOGIN
// Variável global com o usuário logado
var usuarioLogado = null;

function iniciaLogin() {

    //Dados do login
    var email = document.getElementById("EDemail").value.trim();
    var senha = document.getElementById("EDsenha").value.trim();

    //Valida as informações do login
    if (!validaLogin(email, senha,)) {
        return false;
    }

    //Se deu certo salva no localStorage ou sessionStorage dependendo doq o cara escolher
    salvarDados(email, senha, lembrarUsuario());

    return true;
}

function salvarDados(p_email, p_senha, p_lembrar) {

    //Limpa o usuario antigo para evitar conflitos(somente da session, o localStorage é mantido para lembrar o usuario)
    deslogar(false);

    // Extrai o nome de usuário antes do @
    var nomeUsuario = p_email.split("@")[0];

    //Se o usuario quiser ser lembrado salva no localStorage, senao remove do localStorage para que nao fique salvo nada
    if (p_lembrar) {
        localStorage.setItem("lembrarUsuario", "true");
    }
    else {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("lembrarUsuario");
    }

    // Define o usuário logado e redireciona para o index
    if (p_lembrar) {
        //Guarda o usuario no localStorage para manter o login, com a senha.
        usuarioLogado = { email: p_email, nome: nomeUsuario, senha: p_senha };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    }
    else {
        //Guarda o usuario na sessionStorage para manter o login apenas na sessão atual, sem a senha.
        usuarioLogado = { email: p_email, nome: nomeUsuario };
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    }

    //Redireciona para a página principal
    window.location.href = "index.html";
}

function validaLogin(p_email, p_senha) {

    // Validação de campos vazios
    if (p_email === "" || p_senha === "") {
        erro("Por favor, preencha todos os campos.");
        return false;
    }

    // Validação de formato do email
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(p_email)) {
        erro("Por favor, insira um e-mail válido.", ["EDemail"]);
        return false;
    }

    // Validação do tamanho mínimo da senha
    if (p_senha.length < 6) {
        erro("A senha deve ter pelo menos 6 caracteres.", ["EDsenha"]);
        return false;
    }

    //Valida se as credenciais lembradas são validas, se o usuario tiver marcado a opcao "Lembrar-me" e tiver um usuario salvo no localStorage, compara as 
    //credenciais do login com as credenciais salvas, se nao for valido mostra o erro de credenciais invalidas
    validaCredenciaisLembradas(p_email, p_senha);

    return true;
}

function getUsuarioLogado() {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || JSON.parse(sessionStorage.getItem("usuarioLogado"));
    return usuarioLogado;
}

//Deslogar o usuario e redireciona pro login com as informações preenchidas, ou limpa lixo na session
function deslogar(p_redirecionar) {

    sessionStorage.removeItem("usuarioLogado");
    //Removendo a session do usuario logado
    usuarioLogado = null;

    //Se é loguout e o usuario e a opcao lembrarUsuario for true, redireciona para a tela de login, senao so limpa o usuario logado e deixa na mesma pagina
    if (p_redirecionar) {
        window.location.href = "login.html";
        if (localStorage.getItem("lembrarUsuario") === "true") {
            //Joga na pagina de login, com as opcoes da session
            carregaNoLogin();
        }
    }
}

function validaCredenciaisLembradas(p_email, p_senha) {
    //Busca se existe alguem salvo no localStorage
    var usuarioLembrado = JSON.parse(localStorage.getItem("usuarioLogado"));

    //Se nao tem usuario salvo no localStorage e a opcao lembrarUsuario for false, considera as credenciais validas para permitir o login normal
    //Senao eu comparo com o usuario salvo no localStorage
    if (!usuarioLembrado && !lembrarUsuario()) {
        return;
    }

    //Se tem algo diferente retorna false, se for igual retorna true
    if (usuarioLembrado && usuarioLembrado.email === p_email && usuarioLembrado.senha === p_senha) {
       return
    }
    erro("Os dados informados nao batem com os dados lembrados")
}
//Preenche os dados do login de um usuario que marcou a opcao "Lembrar-me"
function carregaNoLogin() {
    if (localStorage.getItem("lembrarUsuario") === "true") {
        var usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuarioLogado) {
            document.getElementById("EDemail").value = usuarioLogado.email;
            document.getElementById("EDsenha").value = usuarioLogado.senha;
            document.getElementById("lembrarMe").checked = true;
        }
    }
}
function lembrarUsuario() {
    var lembrar = document.getElementById("lembrarMe").checked;
    return lembrar;
}


