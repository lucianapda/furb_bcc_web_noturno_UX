const form = document.getElementById("form-animal");
const tabelaCorpo = document.querySelector('#adote-os tbody');

const filtroEspecie = document.getElementById('filtros-especie');
const filtroPorte = document.getElementById('filtros-porte');
const filtroVacinado = document.getElementById('filtros-vacinado');

const btnPaginaAnterior = document.getElementById('btn-pagina-anterior');
const btnPaginaProxima = document.getElementById('btn-pagina-proxima');
const infoPagina = document.getElementById('info-pagina');

const ITENS_POR_PAGINA = 5;
let paginaAtual = 1;

window.onload = () => {
    popularFiltros();
    listarAnimais();

    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        const nomeUsuario = document.querySelector('.nome-usuario');
        if (nomeUsuario) {
            nomeUsuario.innerText = usuarioLogado.nome;
        }
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = form.dataset.id;
    const novoAnimal = {
        nome: document.getElementById('nome').value.trim(),
        especie: document.getElementById('especie').value,
        porte: document.getElementById('porte').value,
        foto: document.getElementById('foto').value.trim(),
        vacinado: document.getElementById('vacina').checked,
    };

    const animais = JSON.parse(localStorage.getItem('animais')) || [];

    if (id !== undefined && id !== '') {
        animais[Number(id)] = novoAnimal;
        delete form.dataset.id;
        form.querySelector('.btn-submit').innerText = "Cadastrar Animal";
    } else {
        animais.push(novoAnimal);
    }

    localStorage.setItem('animais', JSON.stringify(animais));
    form.reset();
    paginaAtual = 1;
    popularFiltros();
    listarAnimais();
});

if (filtroEspecie) filtroEspecie.addEventListener('change', () => {
    paginaAtual = 1;
    listarAnimais();
});
if (filtroPorte) filtroPorte.addEventListener('change', () => {
    paginaAtual = 1;
    listarAnimais();
});
if (filtroVacinado) filtroVacinado.addEventListener('change', () => {
    paginaAtual = 1;
    listarAnimais();
});

if (btnPaginaAnterior) {
    btnPaginaAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            listarAnimais();
        }
    });
}

if (btnPaginaProxima) {
    btnPaginaProxima.addEventListener('click', () => {
        paginaAtual++;
        listarAnimais();
    });
}

function popularFiltros() {
    const animais = JSON.parse(localStorage.getItem('animais')) || [];

    if (filtroEspecie) {
        const valorAtual = filtroEspecie.value;
        const especies = [...new Set(animais.map(a => a.especie).filter(Boolean))];
        filtroEspecie.innerHTML = '<option value="">Todos</option>' +
            especies.map(e => `<option value="${e}">${e}</option>`).join('');
        filtroEspecie.value = valorAtual;
    }

    if (filtroPorte) {
        const valorAtual = filtroPorte.value;
        const portes = [...new Set(animais.map(a => a.porte).filter(Boolean))];
        filtroPorte.innerHTML = '<option value="">Todos</option>' +
            portes.map(p => `<option value="${p}">${p}</option>`).join('');
        filtroPorte.value = valorAtual;
    }
}

function listarAnimais() {
    const animais = JSON.parse(localStorage.getItem('animais')) || [];
    tabelaCorpo.innerHTML = '';

    const especieSelecionada = filtroEspecie ? filtroEspecie.value : '';
    const porteSelecionado = filtroPorte ? filtroPorte.value : '';
    const vacinadoSelecionado = filtroVacinado ? filtroVacinado.value : '';

    const animaisFiltrados = animais.filter((animal) => {
        const bateEspecie = !especieSelecionada || animal.especie === especieSelecionada;
        const batePorte = !porteSelecionado || animal.porte === porteSelecionado;

        const valorVacinado = !!animal.vacinado;
        const bateVacinado =
            !vacinadoSelecionado ||
            (vacinadoSelecionado === 'sim' && valorVacinado) ||
            (vacinadoSelecionado === 'nao' && !valorVacinado);

        return bateEspecie && batePorte && bateVacinado;
    });

    const totalPaginas = Math.max(1, Math.ceil(animaisFiltrados.length / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
    if (paginaAtual < 1) paginaAtual = 1;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const animaisPaginados = animaisFiltrados.slice(inicio, fim);

    if (infoPagina) {
        infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    }
    if (btnPaginaAnterior) {
        btnPaginaAnterior.disabled = paginaAtual === 1;
    }
    if (btnPaginaProxima) {
        btnPaginaProxima.disabled = paginaAtual === totalPaginas;
    }

    animaisPaginados.forEach((animal) => {
        const indexOriginal = animais.findIndex(a =>
            a.nome === animal.nome &&
            a.especie === animal.especie &&
            a.porte === animal.porte &&
            a.foto === animal.foto &&
            !!a.vacinado === !!animal.vacinado
        );

        const linha = `
            <tr>
                <td><img src="${animal.foto}" width="60" height="60" alt="${animal.nome}"></td>
                <td>${animal.nome}</td>
                <td>${animal.especie}</td>
                <td>${animal.porte}</td>
                <td>
                    <button onclick="prepararEdicao(${indexOriginal})" style="background:#2196F3; color:white; padding:5px; border-radius:8px;">Editar</button>
                    <button onclick="excluirAnimal(${indexOriginal})" style="background:#f44336; color:white; padding:5px; border-radius:8px;">Excluir</button>
                </td>
            </tr>
        `;
        tabelaCorpo.innerHTML += linha;
    });
}

function excluirAnimal(index) {
    const animais = JSON.parse(localStorage.getItem('animais')) || [];
    animais.splice(index, 1);
    localStorage.setItem('animais', JSON.stringify(animais));
    popularFiltros();
    const totalAposExclusao = animais.length;
    const totalPaginasAposExclusao = Math.max(1, Math.ceil(totalAposExclusao / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginasAposExclusao) paginaAtual = totalPaginasAposExclusao;
    listarAnimais();
}

window.prepararEdicao = (index) => {
    const animais = JSON.parse(localStorage.getItem('animais')) || [];
    const animal = animais[index];

    if (!animal) return;

    document.getElementById('nome').value = animal.nome;
    document.getElementById('especie').value = animal.especie;
    document.getElementById('porte').value = animal.porte;
    document.getElementById('foto').value = animal.foto;
    document.getElementById('vacina').checked = !!animal.vacinado;

    form.dataset.id = index;
    form.querySelector('.btn-submit').innerText = "Salvar Alterações";
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.excluirAnimal = excluirAnimal;

window.limparFiltros = () => {
    if (filtroEspecie) filtroEspecie.value = '';
    if (filtroPorte) filtroPorte.value = '';
    if (filtroVacinado) filtroVacinado.value = '';
    paginaAtual = 1;
    listarAnimais();
};
