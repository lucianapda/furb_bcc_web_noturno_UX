// Tela de Login
const formLogin = document.getElementById("loginForm");
const form = document.getElementById("form");
const tabela = document.getElementById("tabela");

let dados = JSON.parse(localStorage.getItem("dados")) || [];

if (!Array.isArray(dados)) {
    dados = [];
}

window.onload = () => {
    if (localStorage.getItem("lembrar") === "true") {
        document.getElementById("usuario").value = localStorage.getItem("usuario");
        document.getElementById("lembrar").checked = true;
    }
    if (form) {
        carregarUsuario();
    }
    renderizar();
};

function carregarUsuario() {
    let user = sessionStorage.getItem("nomeDeGuerra");
    document.getElementById("usuarioNome").innerText = user;
}

if (formLogin) {
    const wrapperUsuario = document.getElementById("wrapper-usuario");
    const wrapperSenha = document.getElementById("wrapper-senha");
    const inputUsuario = document.getElementById("usuario");
    const inputSenha = document.getElementById("senha");

    inputUsuario.addEventListener("input", () => wrapperUsuario.classList.remove("error"));
    inputSenha.addEventListener("input", () => wrapperSenha.classList.remove("error"));

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const user = inputUsuario.value.trim();
        const senha = inputSenha.value.trim();
        let valido = true;

        wrapperUsuario.classList.remove("error");
        wrapperSenha.classList.remove("error");

        if (user === "") {
            wrapperUsuario.classList.add("error");
            valido = false;
        }

        if (senha === "") {
            wrapperSenha.classList.add("error");
            valido = false;
        }

        if (!valido) return;

        if (user.split(".").length !== 2) {
            wrapperUsuario.classList.add("error");
            return;
        }

        const userFormatado = user.split(".")[0].toUpperCase() + " " + user.split(".")[1].toUpperCase();
        sessionStorage.setItem("nomeDeGuerra", userFormatado);

        if (document.getElementById("lembrar").checked) {
            localStorage.setItem("lembrar", true);
            localStorage.setItem("usuario", user);
        } else {
            localStorage.setItem("lembrar", false);
        }

        window.location.href = "index.html";
    });
}

function recuperarSenha() {
    alert("Teste troca de senha");
}

function cadastrarUsuario() {
    alert("Teste cadastro de usuário");
}

function goHome() {
    window.location.reload();
}

function menuBar() {
    const menuBar = document.getElementById("menu");
    menuBar.classList.toggle("hidden");
}

if (form) {
    const wrapperNumero = document.getElementById("wrapperNumero")
    const wrapperNome = document.getElementById("wrapperNome")
    const wrapperCompanhia = document.getElementById("wrapperCompanhia")
    const wrapperTipoServico = document.getElementById("wrapperTipoServico")
    const wrapperData = document.getElementById("wrapperData")

    const inputNumero = document.getElementById("numero")
    const inputNome = document.getElementById("nome")
    const inputCompanhia = document.getElementById("companhia")
    const inputTipoServico = document.getElementById("tipoServico")
    const inputData = document.getElementById("data")

    inputNumero.addEventListener("input", () => wrapperNumero.classList.remove("error"));
    inputNumero.addEventListener("input", () => wrapperNome.classList.remove("error"));
    inputNumero.addEventListener("input", () => wrapperCompanhia.classList.remove("error"));
    inputNumero.addEventListener("input", () => wrapperTipoServico.classList.remove("error"));
    inputNumero.addEventListener("input", () => wrapperData.classList.remove("error"));

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let numero = inputNumero.value;
        let nome = inputNome.value;
        let companhia = inputCompanhia.value;
        let tipoServico = inputTipoServico.value;
        let data = inputData.value;
        let index = document.getElementById("indexEdit").value;

        wrapperNumero.classList.remove("error")
        wrapperNome.classList.remove("error")
        wrapperCompanhia.classList.remove("error")
        wrapperTipoServico.classList.remove("error")
        wrapperData.classList.remove("error")

        if (numero === "") {
            wrapperNumero.classList.add("error")
            return
        }

        if (nome === "") {
            wrapperNome.classList.add("error")
            return
        }

        if (companhia === "") {
            wrapperCompanhia.classList.add("error")
            return
        }

        if (tipoServico === "") {
            wrapperTipoServico.classList.add("error")
            return
        }

        if (data === "") {
            wrapperData.classList.add("error")
            return
        } else {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0)
            const dataFormatada = new Date(`${data}T00:00:00`)

            if (dataFormatada.getTime() < hoje.getTime()) {
                wrapperData.classList.add("error")
            }
        }

        let item = { numero, nome, companhia, tipoServico, data };

        if (index === "") {
            dados.push(item);
        } else {
            dados[index] = item;
        }

        localStorage.setItem("dados", JSON.stringify(dados));

        limpar();
        renderizar();
    });
}

function limpar() {
    form.reset();
    document.getElementById("indexEdit").value = "";
}

function renderizar() {
    tabela.innerHTML = "";

    dados.forEach((d, i) => {
        tabela.innerHTML += `
        <tr>
            <td>${d.numero}</td>
            <td>${d.nome}</td>
            <td>${d.companhia}</td>
            <td>${d.tipoServico}</td>
            <td>${d.data}</td>
            <td>
                <button class="btn-md2-icon btn-edit" onclick="editar(${i})" title="Editar">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn-md2-icon btn-delete" onclick="excluir(${i})" title="Excluir">
                  <span class="material-icons">delete</span>
                </button>
            </td>
        </tr>`;
    });
}

function editar(i) {
    let d = dados[i];
    document.getElementById("numero").value = d.numero;
    document.getElementById("nome").value = d.nome;
    document.getElementById("companhia").value = d.companhia;
    document.getElementById("tipoServico").value = d.tipoServico;
    console.log(document.getElementById("data").value)
    document.getElementById("data").value = d.data;
    document.getElementById("indexEdit").value = i;
}

let indexParaExcluir = null;

function excluir(i) {
    indexParaExcluir = i
    document.getElementById('scrim').classList.add('visible');
    document.getElementById('dialog').classList.add('open');

    // if (confirm("Deseja excluir?")) {
    //     dados.splice(i, 1);
    //     localStorage.setItem("dados", JSON.stringify(dados));
    //     renderizar();
    // }
}

function fecharDialog() {
    indexParaExcluir = null;
    document.getElementById('scrim').classList.remove('visible');
    document.getElementById('dialog').classList.remove('open');

}

function fecharDialogConfirm() {
    if (indexParaExcluir === null) return;

    dados.splice(indexParaExcluir, 1);
    localStorage.setItem("dados", JSON.stringify(dados));
    renderizar();

    indexParaExcluir = null;
    document.getElementById('scrim').classList.remove('visible');
    document.getElementById('dialog').classList.remove('open');

}