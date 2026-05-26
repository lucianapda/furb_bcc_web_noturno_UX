const tableBody = document.querySelector(".data-table tbody");
const addGameBtn = document.querySelector(".btn-add-game");
const searchInput = document.querySelector(".input-search");

let editingRow = null;
let currentId = localStorage.length === 0 ? 1 : localStorage.length + 1;

// ABRIR FORM
function openForm(prefillData = null) {
  if (document.getElementById("form-container")) return;

  fetch("elements/form.html")
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML("beforeend", html);

      attachFormEvents(prefillData);

      const overlay = document.getElementById("overlay");
      const form = document.getElementById("form-container");

      // clicar fora fecha
      if (overlay) {
        overlay.addEventListener("click", fecharForm);
      }

      // impedir fechar clicando dentro
      if (form) {
        form.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      }
    });
}

// FECHAR FORM (remove tudo)
function fecharForm() {
  document.getElementById("form-container")?.remove();
  document.getElementById("overlay")?.remove();
  editingRow = null;
}

// ADICIONAR LINHA na tabela do index
function addRow(data) {
  const tr = document.createElement("tr");

  tr.setAttribute("scope", "row");

  tr.innerHTML = `
   <td class="checkbox-cell">
      <input type="checkbox" class="row-checkbox">
    </td>
    <td data-visibility="true">${data.id}</td>
    <td data-visibility="false">${data.nome}</td>
    <td data-visibility="true">${data.categoria}</td>
    <td data-visibility="false">R$ ${data.preco}</td>
    <td data-visibility="false">${data.estudio}</td>
    <td data-visibility="true">${data.plataforma}</td>
    <td data-visibility="false">
      <div class="status-grid">
        <img src="../img/icons/${data.status === "Disponível" ? "checkmarked" : "cancel"}.png" />
        ${data.status}
      </div>
    </td>
    <td data-visibility="false">
      <div class="action-buttons">
        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
      </div>
    </td>
  `;
  tableBody.appendChild(tr);
}

// ADICIONAR LINHAS QUANDO A PÁGINA RECARREGA - localStorage
function addRowWhenLoaded() {
  let data = null;

  for (let i = 1; i <= localStorage.length; i++) {
    let splittedItem = localStorage.getItem(i).split(",");

    data = {
      id: splittedItem[0],
      nome: splittedItem[1],
      categoria: splittedItem[2],
      preco: splittedItem[3],
      estudio: splittedItem[4],
      plataforma: splittedItem[5],
      status: splittedItem[6]
    };

    addRow(data);
  }
}

//Verifica se tem localstorage e se tiver quando pagina carregar, chama funcao
if (localStorage.length > 0)
  document.addEventListener("DOMContentLoaded", addRowWhenLoaded);



// EVENTOS DO FORM
function attachFormEvents(prefillData) {
  const form = document.getElementById("item-form");

  // Preencher dados (edição)
  if (prefillData) {
    document.getElementById("nome").value = prefillData.nome;
    document.getElementById("categoria").value = prefillData.categoria;
    document.getElementById("preco").value = prefillData.preco;
    document.getElementById("estudio").value = prefillData.estudio;
    document.getElementById("plataforma").value = prefillData.plataforma;
    document.getElementById("status").value = prefillData.status;
  }

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      id: currentId,
      nome: document.getElementById("nome").value.trim(),
      categoria: document.getElementById("categoria").value.trim(),
      preco: document.getElementById("preco").value.trim(),
      estudio: document.getElementById("estudio").value.trim(),
      plataforma: document.getElementById("plataforma").value.trim(),
      status: document.getElementById("status").value
    };

    let localData = [
      data.id,
      data.nome,
      data.categoria,
      data.preco,
      data.estudio,
      data.plataforma,
      data.status
    ];

    if (Object.values(data).some(v => v === "")) {
      alert("Preencha todos os campos!");
      return;
    }
    const nomeInput = document.getElementById("nome");

if (nomeInput.value.trim().length < 2) {
    nomeInput.style.borderColor = "#ff0000";

    nomeInput.insertAdjacentHTML("afterend", `
        <div id="warning" style="font-size: 11px; color: #ff0000">
            O nome deve ter no mínimo 2 caracteres
        </div>
    `);
    // Ícone dentro do campo de senha
         if (!document.getElementById("error-icon-nome")) {
             nomeInput.parentElement.insertAdjacentHTML("beforeend", `
                 <img src="img/icons/error.png" alt="Erro" class="error-icon-nome" id="error-icon">
             `);
         }

    setTimeout(() => {
        nomeInput.style.borderColor = "white";
        document.getElementById("warning")?.remove();
        const iconNome = document.getElementById("error-icon-nome");
             if (iconNome) iconNome.remove();
    }, 3000);

    return;
}

    if (editingRow) {
      const cells = editingRow.querySelectorAll("td");
      cells[1].innerText = data.nome;
      cells[2].innerText = data.categoria;
      cells[3].innerText = "R$ " + data.preco;
      cells[4].innerText = data.estudio;
      cells[5].innerText = data.plataforma;
      cells[6].innerText = "";

      const sixthCellHTML = `
      <div class="status-grid">
        <img src="../img/icons/${data.status === "Disponível" ? "checkmarked" : "cancel"}.png" />
        ${data.status}
      </div>
      `

      cells[6].insertAdjacentHTML("afterbegin", sixthCellHTML);

      localData[0] = cells[0].innerText;

      localStorage.setItem(cells[0].innerText, localData);

      editingRow = null;
    } else {
      addRow(data);

      localStorage.setItem(data.id, localData);
      currentId = localStorage.length + 1;
    }

    fecharForm(); // fecha tudo corretamente
  });
}

// BOTÃO ADICIONAR
addGameBtn.addEventListener("click", () => openForm());

// EDITAR / EXCLUIR
tableBody.addEventListener("click", (e) => {
  if (e.target.closest(".edit")) {
    editingRow = e.target.closest("tr");
    const cells = editingRow.querySelectorAll("td");

    const prefillData = {
      id: cells[0].innerText,
      nome: cells[1].innerText,
      categoria: cells[2].innerText,
      preco: cells[3].innerText.split("R$")[1].trim(),
      estudio: cells[4].innerText,
      plataforma: cells[5].innerText,
      status: cells[6].innerText
    };

    openForm(prefillData);
  }

  if (e.target.closest(".delete")) {
    const tdId = e.target.closest("tr").querySelectorAll("td");

    localStorage.removeItem(tdId[0].innerText);
    currentId = tdId[0].innerText;

    e.target.closest("tr").remove();

    if (localStorage.length == 0) {
      currentId = 1;
    }
  }
});

// BUSCA
searchInput.addEventListener("keyup", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

// SORT
const sort = document.getElementById("sort");

function sortTable() {
  if (sort.classList.contains("up")) {
    sort.classList.remove("up");
    sort.classList.add("down");
  } else {
    sort.classList.remove("down");
    sort.classList.add("up");
  }
}

sort.addEventListener("click", sortTable);

// TOOLTIP
const tooltip = document.getElementById("tooltip");
const tooltipText = tooltip.querySelector("p");

function toggleTooltip(e) {
  const targetedTd = e.target.closest("td");

  if (targetedTd && targetedTd.scrollWidth > targetedTd.clientWidth) {
    setTimeout(() => {
      tooltip.classList.add("active");
    }, 750);

    tooltip.style.top = `${e.clientY}px`;
    tooltip.style.left = `${e.clientX}px`;

    tooltipText.innerText = targetedTd.innerText;
  } else {
    tooltip.classList.remove("active");
  }
}

document.addEventListener("mouseover", (e) => {
  toggleTooltip(e);
})

// HEADER / FOOTER
let logoImg = null;
let username = null;
let returnLog = null;

fetch('elements/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('cabecalho').innerHTML = data;

    logoImg = document.querySelector(".logo img");
    username = document.getElementById("username");
    returnLog = document.getElementById("return-log");

    logoImg.addEventListener("click", reloadPage);
    insertUsername();
    returnLog.addEventListener("click", returnToLog);
  });

fetch('elements/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('rodape').innerHTML = data;
  });

function reloadPage() {
  if (logoImg) location.reload();
}

function insertUsername() {
  if (username) {
    if (sessionStorage.getItem("usuario") != null) {
      username.textContent = sessionStorage.getItem("usuario");
    } else {
      username.textContent = "Visitante";
    }
  }
}

window.addEventListener("beforeunload", function () {
  sessionStorage.removeItem("usuario");
});


function returnToLog() {
  if (returnLog) window.open("log.html", "_self");
}