// ============================
// DADOS DO SISTEMA
// ============================

// pega os dados salvos no navegador
var dadosSalvos = localStorage.getItem("gymrutz_dados");

// array que vai guardar os exercícios
var exercicios = [];

// se existir algo salvo no navegador
if (dadosSalvos != null) {
    // transforma o texto salvo em objeto novamente
    exercicios = JSON.parse(dadosSalvos);
}

// ============================
// CARREGAR USUÁRIO DO LOGIN
// ============================

// pega o usuário salvo na sessão
var usuario = sessionStorage.getItem("loggedUser");

// se existir usuário logado
if (usuario) {
    // mostra o nome no topo da página
    document.getElementById("headerUser").innerText = usuario;
} else {
    document.getElementById("headerUser").innerText = "Visitante"
}


// ============================
// LOGO VOLTA PARA HOME
// ============================

// quando clicar na logo
document.getElementById("logoBtn").onclick = function () {

    // volta para a tela inicial
    trocarTela("section-home");

};


// ============================
// NAVEGAÇÃO ENTRE TELAS
// ============================

// função que troca a tela do sistema
function trocarTela(idTela) {

    // pega todas as telas
    var telas = document.querySelectorAll(".tela");

    // esconde todas
    for (var i = 0; i < telas.length; i++) {
        telas[i].style.display = "none";
    }

    // mostra somente a tela escolhida
    document.getElementById(idTela).style.display = "block";

    // atualiza as tabelas
    desenharTabelas();

    // atualiza os cards da home
    fazerResumoCards();
}


// pega todos os botões do menu
var botoesMenu = document.querySelectorAll(".link-menu");

// adiciona evento de clique
for (var i = 0; i < botoesMenu.length; i++) {

    botoesMenu[i].onclick = function () {

        // pega qual tela abrir
        var secao = this.getAttribute("data-section");

        if (secao) {

            trocarTela("section-" + secao);

        }

    };

}


// ============================
// SALVAR EXERCÍCIO
// ============================

// botão salvar
document.getElementById("btnSalvar").onclick = function () {

    // pega valores do formulário
    var nome = document.getElementById("nome").value.trim();
    var grupo = document.getElementById("grupo").value;
    var series = document.getElementById("series").value;
    var reps = document.getElementById("reps").value;
    var peso = document.getElementById("peso").value;

    // pega id caso seja edição
    var idEdicao = document.getElementById("editId").value;

    // ======================
    // VALIDAÇÃO DOS CAMPOS
    // ======================

    if (nome === "") {
        alert("Digite o nome do exercício");
        return;
    }

    if (grupo === "") {
        alert("Escolha um grupo muscular");
        return;
    }

    if (series === "" || reps === "") {
        alert("Preencha séries e repetições");
        return;
    }

    // cria objeto do exercício
    var exercicio = {

        // se for edição usa o id antigo
        id: idEdicao ? idEdicao : Date.now(),

        nome: nome,
        grupo: grupo,
        series: series,
        reps: reps,

        // peso vira número
        peso: parseFloat(peso) || 0
    };

    // ======================
    // EDIÇÃO OU NOVO CADASTRO
    // ======================

    if (idEdicao) {

        // procura o exercício para editar
        for (var i = 0; i < exercicios.length; i++) {

            if (exercicios[i].id == idEdicao) {

                exercicios[i] = exercicio;

            }

        }

        // limpa id de edição
        document.getElementById("editId").value = "";

    } else {

        // adiciona novo exercício
        exercicios.push(exercicio);

    }

    // salva no navegador
    localStorage.setItem("gymrutz_dados", JSON.stringify(exercicios));

    // limpa formulário
    limparFormulario();

    // atualiza tabela
    desenharTabelas();

    // volta para lista
    trocarTela("section-exercicios");

};


// ============================
// LIMPAR FORMULÁRIO
// ============================

// botão limpar
document.getElementById("btnLimpar").onclick = limparFormulario;

// função que limpa os campos
function limparFormulario() {

    document.getElementById("nome").value = "";
    document.getElementById("grupo").value = "";
    document.getElementById("series").value = "";
    document.getElementById("reps").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("editId").value = "";

}


// ============================
// DESENHAR TABELAS
// ============================

// cria as linhas da tabela
function desenharTabelas() {

    var tabelaHome = document.getElementById("homeTableBody");
    var tabelaLista = document.getElementById("mainTableBody");

    // limpa tabelas antes de desenhar
    tabelaHome.innerHTML = "";
    tabelaLista.innerHTML = "";

    // percorre os exercícios
    for (var i = 0; i < exercicios.length; i++) {

        var e = exercicios[i];

        // cria linha
        var linha = document.createElement("tr");

        // conteúdo da linha
        linha.innerHTML =
            "<td>" + e.nome + "</td>" +
            "<td>" + e.grupo + "</td>" +
            "<td>" + e.series + "</td>" +
            "<td>" + e.reps + "</td>" +
            "<td>" + e.peso + "kg</td>" +
            "<td>" +
            "<div class='table-actions'>" +
            "<button class='btn-table btn-edit' onclick='editarExercicio(" + e.id + ")'>" +
            "Editar" +
            "</button>" +
            "<button class='btn-table btn-delete' onclick='apagarExercicio(" + e.id + ")'>" +
            "Excluir" +
            "</button>" +
            "</div>" +
            "</td>";

        // adiciona na tabela principal
        tabelaLista.appendChild(linha);

        // últimos 3 aparecem na home
        if (i >= exercicios.length - 3) {

            var linhaHome = document.createElement("tr");

            linhaHome.innerHTML =
                "<td>" + e.nome + "</td>" +
                "<td>" + e.grupo + "</td>" +
                "<td>" + e.series + "</td>" +
                "<td>" + e.peso + "kg</td>";

            tabelaHome.appendChild(linhaHome);

        }

    }

}


// ============================
// CARDS DA HOME
// ============================

// atualiza informações da dashboard
function fazerResumoCards() {

    // total de exercícios
    document.getElementById("statTotal").innerText = exercicios.length;

    var maiorPeso = 0;

    // procura maior peso
    for (var i = 0; i < exercicios.length; i++) {

        if (exercicios[i].peso > maiorPeso) {

            maiorPeso = exercicios[i].peso;

        }

    }

    // mostra maior peso
    document.getElementById("statMaxPeso").innerText = maiorPeso + "kg";

}


// ============================
// EDITAR EXERCÍCIO
// ============================

function editarExercicio(id) {

    for (var i = 0; i < exercicios.length; i++) {

        if (exercicios[i].id == id) {

            var e = exercicios[i];

            // coloca dados no formulário
            document.getElementById("nome").value = e.nome;
            document.getElementById("grupo").value = e.grupo;
            document.getElementById("series").value = e.series;
            document.getElementById("reps").value = e.reps;
            document.getElementById("peso").value = e.peso;

            // salva id para edição
            document.getElementById("editId").value = e.id;

            // abre tela de cadastro
            trocarTela("section-novo");

        }

    }

}


// ============================
// EXCLUIR EXERCÍCIO
// ============================

function apagarExercicio(id) {

    // confirmação
    if (!confirm("Deseja excluir este exercício?")) return;

    var novaLista = [];

    // recria lista sem o item excluído
    for (var i = 0; i < exercicios.length; i++) {

        if (exercicios[i].id != id) {

            novaLista.push(exercicios[i]);

        }

    }

    exercicios = novaLista;

    // salva nova lista
    localStorage.setItem("gymrutz_dados", JSON.stringify(exercicios));

    // atualiza tabela
    desenharTabelas();

}


// ============================
// INICIAR SISTEMA
// ============================

// abre home ao iniciar
trocarTela("section-home");

// desenha tabela caso tenha dados salvos
desenharTabelas();