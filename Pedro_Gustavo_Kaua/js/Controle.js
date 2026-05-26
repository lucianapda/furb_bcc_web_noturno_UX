let gatos = JSON.parse(localStorage.getItem("gatos")) || [];

let indiceEditando = -1;
let ordemNomeAsc = true;
const OPCOES_RPP = [5, 10, 25];
let gatosPorPagina = 10;
let paginaAtual = 1;








function excluirGato(i) {
  var gatosSalvos = JSON.parse(localStorage.getItem("gatos")) || [];
  gatosSalvos.splice(i, 1);
  gatos = gatosSalvos;
  localStorage.setItem("gatos", JSON.stringify(gatos));
  renderizarTabela();
}










function alterarGato(i) {
  var gatosSalvos = JSON.parse(localStorage.getItem("gatos")) || [];
  var gato = gatosSalvos[i];

  document.getElementById("nome_gato").value = gato.nome;
  document.getElementById("raca_gato").value = gato.raca;
  document.getElementById("idadeGato").value = gato.idade;
  document.querySelector('input[name="sexo"][value="' + gato.sexo + '"]').checked = true;
  indiceEditando = i;
}







function excluirSelecionados() {
  var checkboxes = document.querySelectorAll(".checkbox-gato:checked");
  var gatosSalvos = JSON.parse(localStorage.getItem("gatos")) || [];
  var novaLista = [];
  var indicesMarcados = [];

  for (var i = 0; i < checkboxes.length; i++) {
    indicesMarcados.push(Number(checkboxes[i].getAttribute("data-indice")));
  }

  for (var i = 0; i < gatosSalvos.length; i++) {
    var marcado = false;
    for (var j = 0; j < indicesMarcados.length; j++) {
      if (indicesMarcados[j] === i) {
        marcado = true;
      }
    }
    if (!marcado) {
      novaLista.push(gatosSalvos[i]);
    }
  }

  gatos = novaLista;
  localStorage.setItem("gatos", JSON.stringify(gatos));
  paginaAtual = 1;
  renderizarTabela();
}








function renderizarTabela() {
  var tabela = document.getElementById("tabela-gatos");
  var setaAtual = ordemNomeAsc ? "▲" : "▼";

  tabela.innerHTML =
    "<tr>" +
      "<th class='col-selecao'><input type='checkbox' id='selecionar-todos' aria-label='Selecionar todos os gatos'></th>" +
      "<th id='th-nome'><button type='button' class='btn-ordenar' onclick='ordenarPorNome()'>Nome <span class='seta-ordenacao'>" + setaAtual + "</span></button></th>" +
      "<th>Raça</th>" +
      "<th>Sexo</th>" +
      "<th>Idade</th>" +
      "<th>Ações</th>" +
    "</tr>";

  var gatosSalvos = JSON.parse(localStorage.getItem("gatos")) || [];
  var total = gatosSalvos.length;
  var inicio = (paginaAtual - 1) * gatosPorPagina;
  var fim = inicio + gatosPorPagina;
  if (fim > total) {
    fim = total;
  }

  for (var i = inicio; i < fim; i++) {
    var gato = gatosSalvos[i];
    var linha = document.createElement("tr");
    linha.innerHTML =
      "<td class='col-selecao'><input type='checkbox' class='checkbox-gato' data-indice='" + i + "'></td>" +
      "<td>" + gato.nome + "</td>" +
      "<td>" + gato.raca + "</td>" +
      "<td>" + gato.sexo + "</td>" +
      "<td>" + gato.idade + "</td>" +
      "<td>" +
        "<button class='btn-alterar' onclick='alterarGato(" + i + ")'>Alterar</button>" +
        "<button class='btn-excluir' onclick='excluirGato(" + i + ")'>Excluir</button>" +
      "</td>";
    tabela.appendChild(linha);
  }

  renderizarPaginacao(total);
  configurarCheckboxes();
}











function renderizarPaginacao(total) {
  var rodape = document.getElementById("paginacao-footer");
  var totalPaginas = Math.ceil(total / gatosPorPagina);
  var inicio = (paginaAtual - 1) * gatosPorPagina;
  var fim = inicio + gatosPorPagina;
  if (fim > total) {
    fim = total;
  }

  var opcoesHTML = "";
  for (var i = 0; i < OPCOES_RPP.length; i++) {
    var numero = OPCOES_RPP[i];
    if (numero === gatosPorPagina) {
      opcoesHTML += "<option value='" + numero + "' selected>" + numero + "</option>";
    } else {
      opcoesHTML += "<option value='" + numero + "'>" + numero + "</option>";
    }
  }

  rodape.innerHTML =
    "<div class='pag-footer'>" +
      "<button class='btn-excluirSelecionados' id='botao-excluir-selecionados' onclick='excluirSelecionados()' disabled>Excluir selecionados</button>" +
      "<div class='pag-rpp'>" +
        "<span>Linhas por página:</span>" +
        "<select id='pag-select' class='pag-select'>" + opcoesHTML + "</select>" +
      "</div>" +
      "<span class='pag-range'>" + (inicio + 1) + "–" + fim + " de " + total + "</span>" +
      "<div class='pag-seta'>" +
        "<button class='pag-botao' id='botao-anterior' aria-label='Página anterior'>&#8249;</button>" +
        "<button class='pag-botao' id='botao-proximo' aria-label='Próxima página'>&#8250;</button>" +
      "</div>" +
    "</div>";

  var botaoAnterior = document.getElementById("botao-anterior");
  var botaoProximo = document.getElementById("botao-proximo");

  if (paginaAtual === 1) {
    botaoAnterior.disabled = true;
  }
  if (paginaAtual === totalPaginas) {
    botaoProximo.disabled = true;
  }

  document.getElementById("pag-select").addEventListener("change", function () {
    gatosPorPagina = Number(this.value);
    paginaAtual = 1;
    renderizarTabela();
  });

  botaoAnterior.addEventListener("click", function () {
    paginaAtual--;
    renderizarTabela();
  });

  botaoProximo.addEventListener("click", function () {
    paginaAtual++;
    renderizarTabela();
  });
}












function configurarCheckboxes() {
  var selecionarTodos = document.getElementById("selecionar-todos");
  var checkboxes = document.querySelectorAll(".checkbox-gato");

  selecionarTodos.addEventListener("change", function () {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = selecionarTodos.checked;
      var linha = checkboxes[i].closest("tr");
      if (selecionarTodos.checked) {
        linha.classList.add("linha-selecionada");
      } else {
        linha.classList.remove("linha-selecionada");
      }
    }
    atualizarBotaoExcluir();
  });

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", function () {
      var linha = this.closest("tr");
      if (this.checked) {
        linha.classList.add("linha-selecionada");
      } else {
        linha.classList.remove("linha-selecionada");
        selecionarTodos.checked = false;
      }
      atualizarBotaoExcluir();
    });
  }
}








function atualizarBotaoExcluir() {
  var checkboxes = document.querySelectorAll(".checkbox-gato");
  var totalMarcados = 0;

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      totalMarcados++;
    }
  }

  var botao = document.getElementById("botao-excluir-selecionados");
  if (totalMarcados > 0) {
    botao.disabled = false;
  } else {
    botao.disabled = true;
  }
}






function abrirMenu() {
  document.getElementById('menu').classList.add('aberto');
  document.getElementById('scrim').classList.add('ativo');
  document.body.style.overflow = 'hidden';
}









function fecharMenu() {
  document.getElementById('menu').classList.remove('aberto');
  document.getElementById('scrim').classList.remove('ativo');
  document.body.style.overflow = '';
}











function ordenarPorNome() {
  var listaGatos = JSON.parse(localStorage.getItem("gatos")) || [];
  listaGatos.sort(function (a, b) {
    if (ordemNomeAsc) {
      return a.nome.localeCompare(b.nome);
    } else {
      return b.nome.localeCompare(a.nome);
    }
  });
  localStorage.setItem("gatos", JSON.stringify(listaGatos));
  ordemNomeAsc = !ordemNomeAsc;
  renderizarTabela();
}








function cadastrar_Gato(event) {
  event.preventDefault();

  var nome = document.getElementById("nome_gato").value;
  var raca = document.getElementById("raca_gato").value;
  var sexoSelecionado = document.querySelector('input[name="sexo"]:checked');
  var idade = document.getElementById("idadeGato").value;

  if (nome === "") { alert("Insira o nome do gato!"); return; }
  if (raca === "") { alert("Insira a raça do gato!"); return; }
  if (!sexoSelecionado) { alert("Selecione o sexo do gato!"); return; }

  var gato = { nome: nome, raca: raca, sexo: sexoSelecionado.value, idade: idade };

  if (indiceEditando === -1) {
    gatos.push(gato);
  } else {
    gatos[indiceEditando] = gato;
    indiceEditando = -1;
  }

  localStorage.setItem("gatos", JSON.stringify(gatos));
  renderizarTabela();
  alert("Gato cadastrado com sucesso!");
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarTabela();
});

document.querySelector(".formGato").addEventListener("submit", cadastrar_Gato);

document.addEventListener("DOMContentLoaded", function () {
  var listar = document.getElementById("listar");
  listar.addEventListener("click", function () {
    renderizarTabela();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("status") === "true") {
    document.getElementById("status-value").textContent = "Logado";
    document.getElementById("pata").src = "https://cdn-icons-png.flaticon.com/512/190/190411.png";
  }
});
