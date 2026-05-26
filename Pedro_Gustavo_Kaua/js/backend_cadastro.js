document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("lembrarMe")) {
    if (localStorage.getItem("lembrarMe") === "true") {
      document.getElementById("lembrarMe").checked = true;
    }
  }

  if (sessionStorage.getItem("status") === "true") {
    var nome = sessionStorage.getItem("usuario");

    if (document.getElementById("statusLabel"))
      document.getElementById("statusLabel").textContent = "Ativo";
    if (document.getElementById("statusIcon"))
      document.getElementById("statusIcon").checked = true;
    if (document.getElementById("status-value"))
      document.getElementById("status-value").textContent = nome;
    if (document.getElementById("pata"))
      document.getElementById("pata").src = "../img/iconePataVerde.png";
  }

  document.addEventListener("keydown", function (event) {
    var inputNome = document.getElementById("textfield-inputUsuario");
    var inputSenha = document.getElementById("textfield-input");

    if (!inputNome || !inputSenha) return;

    if (event.key === "Enter") {
      cadastrar(inputNome.value, inputSenha.value);
    }
    if (event.code === "Backspace") {
      sair();
    }
  });

  var detalhes = document.getElementById("details-description");
  var summary = document.getElementById("sumario");

  if (detalhes && summary) {
    var textoOriginal = summary.textContent;
    detalhes.addEventListener("toggle", function () {
      summary.textContent = this.open ? "Fechar informações" : textoOriginal;
    });
  }
});

function salvarDados(nome) {
  sessionStorage.setItem("status", "true");
  sessionStorage.setItem("usuario", nome);
}

function cookies() {
  document.cookie = "logado=true; max-age=3600; path=/";
}

function sair() {
  sessionStorage.clear();
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

function cadastrar(nome, senha) {
  var containerUsuario = document.getElementById("textfield-containerUsuario");
  var containerSenha = document.getElementById("textfield-containerSenha");

  if (!containerUsuario || !containerSenha) return;

  var error = false;

  if (nome.trim() === "") {
    containerUsuario.classList.add("is-invalid");
    containerUsuario.classList.remove("is-valid");
    error = true;
  } else {
    containerUsuario.classList.remove("is-invalid");
    containerUsuario.classList.add("is-valid");
  }

  if (senha === "") {
    containerSenha.classList.add("is-invalid");
    containerSenha.classList.remove("is-valid");
    error = true;
  } else {
    containerSenha.classList.remove("is-invalid");
    containerSenha.classList.add("is-valid");
  }

  if (document.getElementById("lembrarMe") && document.getElementById("lembrarMe").checked) {
    localStorage.setItem("lembrarMe", "true");
  } else {
    localStorage.removeItem("lembrarMe");
  }

  if (error) return;

  cookies();
  salvarDados(nome);
  alert("Você logou com sucesso!");
  window.location.href = "TelaPrincipal.html";
}
