//Variaveis globais da tela
let tabelaTreinos = null;
let checkbox = null;
let infoPaginacao = null;

//Campos do modal
let nome = null;
let grupo = null;
let serie = null;
let reps = null;
let editIndex = null; // Variável para controlar se estamos editando ou adicionando um treino

//Metodo que inicia as variaveis globais da tela, chamado no onload do index.html
function iniciaTreino() {
    tabelaTreinos = document.querySelector("#tabelaTreinos tbody");
    nome = document.getElementById("EDnome");
    grupo = document.getElementById("EDgrupo");
    serie = document.getElementById("EDserie");
    reps = document.getElementById("EDreps");

    //Campos da table
    checkbox = document.getElementById("CKtreinos");
    infoPaginacao = document.getElementById("infoPaginacao");

    //Carrega a tabela de treinos
    carregarTabelaTreinos();
}

//Abre o modal que adicionar treino
function adicionarTreino() {
    //Abre o modal
    abreModal();

    //Limpa os campos do modal
    limparCampos();
}

//Chamado no botao de salvar no modal de treino
function salvarTreino() {

     
    //Primeiro validar os campos
    if (!validarTreino()) {
        return;
    }

    //Criar o objeto treino
    let treino = {
        nome: nome.value.trim(),
        grupo: grupo.value.trim(),
        series: serie.value.trim(),
        reps: reps.value.trim()
    };

    //Define se é para substituir ou editar o treino dependendo se o editIndex tem valor ou nao
    if (editIndex !== null) {
        // Recuperar os treinos do localStorage
        let treinos = obterTreinos();

        // Substituir o treino no array
        treinos[editIndex] = treino;

        // Salvar o array atualizado no localStorage
        localStorage.setItem("treinos", JSON.stringify(treinos));

        // Resetar o editIndex após a edição
        editIndex = null;
    } else {
        //Salvar o treino no localStorage, pois é um novo treino
        salvarTreinoLocalStorage(treino);
    }
    //Fechar o modal
    fechaModal();

    //Recarregar a tabela de treinos apos adicionar o novo treino
    carregarTabelaTreinos();
}

function editarTreino(p_index) {
    // Recuperar os treinos do localStorage
    let treinos = obterTreinos();

    // Obter o treino a ser editado
    let treino = treinos[p_index];

    // Preencher os campos do modal com os dados do treino
    nome.value = treino.nome;
    selecionarGrupoMuscular(treino.grupo);
    serie.value = treino.series;
    reps.value = treino.reps;

    // Abrir o modal
    abreModal();

    // Definir o index do treino que está sendo editado
    editIndex = p_index;
}

function excluirTreino(p_index) {
    //Confirmação para evitar exclusões acidentais
    if (!confirm("Voce realmente quer excluir este treino?")) {
        return;
    }

    // Recuperar os treinos do localStorage
    let treinos = obterTreinos();

    // Remover o treino do array
    treinos.splice(p_index, 1);

    // Salvar o array atualizado no localStorage
    localStorage.setItem("treinos", JSON.stringify(treinos));

    // Recarregar a tabela de treinos após a exclusão
    carregarTabelaTreinos();
}

function salvarTreinoLocalStorage(p_treino) {
    // Recuperar os treinos do localStorage
    let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

    // Adicionar o novo treino
    treinos.push(p_treino);

    // Salvar de volta no localStorage
    localStorage.setItem("treinos", JSON.stringify(treinos));
}

function carregarTabelaTreinos() {
    // Limpar a tabela
    tabelaTreinos.innerHTML = "";

    // Recuperar os treinos do localStorage
    let treinos = obterTreinos();

    // Preencher a tabela com os treinos
    treinos.forEach(function (treino, index) {
        //Inserindo cada coluna do treino na tabela
        let row = tabelaTreinos.insertRow();

        let cellCheck = row.insertCell(0);
        cellCheck.className = "col-check";
        cellCheck.innerHTML = `<input type="checkbox" class="check-treino" aria-label="Selecionar treino" onclick="marcarLinhaSelecionada(this)">`;

        let cellStatus = row.insertCell(1);
        cellStatus.innerHTML = `
    <button type="button" class="md2-inline-menu" title="Status do treino">
        Ativo
        <span class="material-symbols-outlined">arrow_drop_down</span>
    </button>
`;
        row.insertCell(2).textContent = treino.nome;
        row.insertCell(3).textContent = treino.grupo;

        let cellSeries = row.insertCell(4);
        cellSeries.textContent = treino.series;
        cellSeries.className = "numeric";

        let cellReps = row.insertCell(5);
        cellReps.textContent = treino.reps;
        cellReps.className = "numeric";

        let cellAcoes = row.insertCell(6);
        cellAcoes.className = "col-acoes";

        cellAcoes.innerHTML = `
    <button class="btn-excluir-treino" onclick="excluirTreino(${index})" title="Excluir treino">
        <span class="material-symbols-outlined">delete</span>
    </button>
    <button class="btn-editar-treino" onclick="editarTreino(${index})" title="Editar treino">
        <span class="material-symbols-outlined">edit</span>
    </button>
`;
    });

    atualizarCheckTodosTreinos();
    atualizarInfoTabela(treinos.length);
}

function selecionarTodosTreinos() {
    let checksTreinos = document.querySelectorAll(".check-treino");

    checksTreinos.forEach(function (check) {
        
        check.checked = checkbox.checked;

        let linha = check.closest("tr");

        if (check.checked) {
            linha.classList.add("linha-selecionada");
        } else {
            linha.classList.remove("linha-selecionada");
        }
    });

    atualizarCheckTodosTreinos();
}

function atualizarCheckTodosTreinos() {
    let checksTreinos = document.querySelectorAll(".check-treino");

    if (!checkbox) {
        return;
    }

    if (checksTreinos.length === 0) {
        checkbox.checked = false;
        checkbox.indeterminate = false;
        return;
    }

    let totalSelecionados = Array.from(checksTreinos).filter(function (check) {
        return check.checked;
    }).length;

    checkbox.checked = Array.from(checksTreinos).every(function (check) {
        return check.checked;
    });
    checkbox.indeterminate = totalSelecionados > 0 && totalSelecionados < checksTreinos.length;
}

function marcarLinhaSelecionada(p_check) {
    let linha = p_check.closest("tr");

    if (p_check.checked) {
        linha.classList.add("linha-selecionada");
    } else {
        linha.classList.remove("linha-selecionada");
    }

    atualizarCheckTodosTreinos();
}

function selecionarGrupoMuscular(p_grupo) {
    grupo.value = p_grupo || "";

    if (grupo.value === p_grupo || !p_grupo) {
        return;
    }

    let opcao = document.createElement("option");
    opcao.value = p_grupo;
    opcao.textContent = p_grupo;
    grupo.appendChild(opcao);
    grupo.value = p_grupo;
}

function atualizarInfoTabela(p_totalTreinos) {
    if (!infoPaginacao) {
        return;
    }

    if (p_totalTreinos === 0) {
        infoPaginacao.textContent = "0-0 de 0";
        return;
    }

    infoPaginacao.textContent = "1-" + Math.min(p_totalTreinos, 5) + " de " + p_totalTreinos;
}

function mudarOrdenacao(p_botao) {
    let botoesOrdenacao = document.querySelectorAll(".md2-sort-header");
    let iconeClicado = p_botao.querySelector(".material-symbols-outlined");
    let estavaAtivo = p_botao.classList.contains("md2-sort-active");
    let estavaDescendo = iconeClicado.textContent.trim() === "arrow_downward";

    botoesOrdenacao.forEach(function (botao) {
        let icone = botao.querySelector(".material-symbols-outlined");

        botao.classList.remove("md2-sort-active");
        icone.textContent = "arrow_downward";
    });

    p_botao.classList.add("md2-sort-active");

    if (estavaAtivo && estavaDescendo) {
        iconeClicado.textContent = "arrow_upward";
    } else {
        iconeClicado.textContent = "arrow_downward";
    }
}

function obterTreinos() {
    // Recuperar os treinos do localStorage
    let treinos = JSON.parse(localStorage.getItem("treinos")) || [];
    return treinos;
}

function validarTreino() {
    //Variaveis com .trim() somente para validar.
    let nomeTreino = nome.value.trim();
    let grupoTreino = grupo.value.trim();
    let serieTreino = serie.value.trim();
    let repsTreino = reps.value.trim();

    //Antes de validar os treinos primeiro removo o erro caso tenha alguma validação anterior
    limparErro("EDnome");
    limparErro("EDgrupo");
    limparErro("EDserie");
    limparErro("EDreps");

    if (nomeTreino === "" & grupoTreino === "" & serieTreino === "" & repsTreino === "") {
        erro("Por favor, preencha todos os campos do treino.", ["EDnome", "EDgrupo", "EDserie", "EDreps"]);
        return false;
    }

    if (nomeTreino === "") {
        erro("Por favor, preenche o nome do treino", ["EDnome"]);
        return false
    }

    if (grupoTreino === "") {
        erro("Por favor, selecione o grupo musculçar do treino.", ["EDgrupo"]);
        return false
    }

    if (nomeTreino.length < 3) {
        erro("O nome do treino deve ter pelo menos 3 caracteres.", ["EDnome"]);
        return false;
    }

    if (Number(serieTreino) <= 0 || !Number.isInteger(Number(serieTreino))) {
        erro("As series devem ser um numero inteiro maior que zero.", ["EDserie"]);
        return false;
    }

    if (Number(repsTreino) <= 0 || !Number.isInteger(Number(repsTreino))) {
        erro("As repeticoes devem ser um numero inteiro maior que zero.", ["EDreps"]);
        return false;
    }

    return true;
}

function limparCampos() {
    nome.value = "";
    grupo.value = "";
    serie.value = "";
    reps.value = "";

    limparErro("EDnome");
    limparErro("EDgrupo");
    limparErro("EDserie");
    limparErro("EDreps");
}

function abreModal() {
    document.getElementById("modal").classList.add("modal-aberto");
}

function fechaModal() {
    document.getElementById("modal").classList.remove("modal-aberto");
}
