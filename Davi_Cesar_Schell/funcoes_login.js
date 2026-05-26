// Essa parte do código serve para carregar os dados de login
// caso eles tenham sido colocados para lembrar
window.onload = function () {
    const lembrar = localStorage.getItem('lembrarMe') == 'true';
    if (lembrar) {
        document.getElementById("remember").checked = true;
        document.getElementById("email").value = localStorage.getItem('emailSalvo') || "";
        document.getElementById("password").value = localStorage.getItem('senhaSalva') || "";
    }
};

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value;
    const lembrarMe = document.getElementById('remember').checked;

    // validação padrão de email e senha
    if (email == "" || senha == "") {
        alert("Preencha todos os campos!");
        return;
    }

    // validação de formato de email
    const validacaoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validacaoEmail.test(email)) {
        alert("Por favor, insira um email válido!");
        document.getElementById('email').focus();
        return;
    }

    if (senha.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres!");
        document.getElementById('password').focus();
        return;
    }

    // logins de teste
    const credenciaisValidas = {
        'teste@adocao.com': '12345678',
        'admin@adocao.com': 'adocao123',
        'usuario@exemplo.com': 'senha1234'
    };

    //verifica se as credenciais estão corretas
    if (!credenciaisValidas[email] || credenciaisValidas[email] !== senha) {
        alert("Email ou senha incorretos! Tente novamente.");
        document.getElementById('password').value = ''; // Limpa senha em erro
        document.getElementById('password').focus();
        return;
    }

    const usuarioLogado = {
        nome: email, // exibe o email informado no login
        email: email
    };

    // armazena o usuario na sessionStorage para que o index.html possa usar
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    // aqui é a questão de lembrar a senha
    if (lembrarMe) {
        localStorage.setItem('lembrarMe', 'true');
        localStorage.setItem('emailSalvo', email);
        localStorage.setItem('senhaSalva', senha);
    } else {
        localStorage.removeItem('lembrarMe');
        localStorage.removeItem('emailSalvo');
        localStorage.removeItem('senhaSalva');
    }

    // Marca um login recém-realizado para não limpar a sessão no primeiro carregamento do index
    sessionStorage.setItem('loginRecente', 'true');

    alert("Login realizado com sucesso! 🎉");
    window.location.href = "index.html";
});
