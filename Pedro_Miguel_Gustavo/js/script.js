//Função que inicia o JS da página(foi colocado para não dar conflito nos fetchs assim que chamado na página)
function iniciarJS() {

    //Criando as constantes para usar nas funcoes do JS
    const adicionarTarefaBotao = document.getElementById('add-task-btn');//botão de adicionar tarefa
    const limpaFormulario = document.getElementById('clean-task-btn');//botão de limpar o fomulario

    //Inputs do forms
    const tituloTarefaInput = document.getElementById('task-title');//Input de titulo da tarefa
    const descricaoTarefaInput = document.getElementById('task-description');//Input de descrição da tarefa
    const categoriaSelecionada = document.getElementById('category');//Input de categoria da tarefa
    const prioridadeRadios = document.querySelectorAll('input[name="task-priority"]');//Input de prioridade da tarefa
    
    //Constantes dos erros
    const tituloErro = document.getElementById('title-error');
    const descricaoErro = document.getElementById('description-error');
    const categoriaErro = document.getElementById('category-error');
    const prioridadeErro = document.getElementById('priority-error');
    const taskAlert = document.getElementById('task-alert');

    //Constantes do modal de exclusão de tarefas
    const deleteModal = document.getElementById('delete-modal');
    const confirmDelete = document.getElementById('confirm-delete');
    const cancelDelete = document.getElementById('cancel-delete');

    tituloTarefaInput.addEventListener('input', () => {
        if (tituloTarefaInput.value.trim()) {
            tituloErro.textContent = '';
        }
    });

    descricaoTarefaInput.addEventListener('input', () => {
        if (descricaoTarefaInput.value.trim()) {
            descricaoErro.textContent = '';
        }
    });

    categoriaSelecionada.addEventListener('change', () => {
        if (categoriaSelecionada.value) {
            categoriaErro.textContent = '';
        }
    });

    prioridadeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            prioridadeErro.textContent = '';
        });
    });
    
    //Tabela de tarefas
    const tarefasTable = document.querySelector('#tasks-table tbody');

    //Menu nav
    const navListar = document.getElementById('nav-listar');//Sessão de aparecer a tabela
    const navAdicionar = document.getElementById('nav-adicionar');//Sessão de aparecer o forms
    const navLogin = document.getElementById('nav-login')//Sessão de voltar para o login

    //Sessão Main(Principal)
    const formsSection = document.getElementById('forms-section');//Formulario
    const tableSection = document.getElementById('table-section');//Tabela

    //Variavel para dizer se esta sendo editado ou não
    let linhaEditada = null;

    //Retorna a lista de todas as tarefas salvas na local storage
    function getTarefas() {
        return JSON.parse(localStorage.getItem('tarefas')) || [];
    }

    //Recebe uma lista de tarefas que é colocada no localStorage
    function salvarTarefas(tarefas) {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    //Recebe um argumento 'forms' ou 'table' onde se for 'forms' ele mostrará o formulario ou a tabela 
    function mostrarSessao(sessao) {
        formsSection.style.display = 'none';
        tableSection.style.display = 'none';

        if (sessao === 'forms') {
            formsSection.style.display = 'flex';
        } else if (sessao === 'table') {
            tableSection.style.display = 'block';
        }

        navAdicionar.classList.toggle('active', sessao === 'forms');
        navListar.classList.toggle('active', sessao === 'table');
    }

    //Sessões nav, quando clicadas serão executadas as suas determinadas funções
    navListar.addEventListener('click', () => mostrarSessao('table'));//Mostra a sessão de table e some a sessão de forms
    navAdicionar.addEventListener('click', () => mostrarSessao('forms'));//Mostra a sessão de forms e some a sessão de table
    navLogin.addEventListener('click', () => window.location.href = '../html/login.html')//Leva para a página de login

    //Por padrão ativa somente o forms como visivel
    mostrarSessao('forms');

    //Função adição de tarefas que é executada ao clicar o botão de adicionar tarefa
    adicionarTarefaBotao.addEventListener('click', function (event) {
        
        //Evita que a página recarregue quando o botão é clicado
        event.preventDefault();

        //adiciona os valores dos inputs em variaveis
        const tituloTarefa = tituloTarefaInput.value.trim()
        const descricaoTarefa = descricaoTarefaInput.value.trim()
        const categoriaTarefa = categoriaSelecionada.value
        let prioridade = ''


        //Procura qual botão de prioridade foi selecionado
        for (const radio of prioridadeRadios) {
            if (radio.checked) {
                prioridade = radio.value;
                break
            }
        }

        //Verifica se quando o botão foi clicado todos os inputs contem algum conteudo(não estão vazies)
        tituloErro.textContent = '';
        descricaoErro.textContent = '';
        categoriaErro.textContent = '';
        prioridadeErro.textContent = '';

        let formularioValido = true;

        if (!tituloTarefa) {
            tituloErro.textContent = 'Preencha o título da tarefa';
            formularioValido = false;
        }

        if (!descricaoTarefa) {
            descricaoErro.textContent = 'Preencha a descrição da tarefa';
            formularioValido = false;
        }

        if (!categoriaTarefa) {
            categoriaErro.textContent = 'Selecione uma categoria';
            formularioValido = false;
        }

        if (!prioridade) {
            prioridadeErro.textContent = 'Selecione uma prioridade';
            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        const tarefas = getTarefas();

        //Se quando botão for clicado e uma tarefa estiver sendo editada, ele pega o indice(linhaEditada) e coloca os novos valores
        if (linhaEditada !== null) {
            tarefas[linhaEditada] = {
                titulo: tituloTarefa,
                descricao: descricaoTarefa,
                categoria: categoriaTarefa,
                prioridade: prioridade
            };

            linhaEditada = null;//Tranforma em null novamente para que não fique "em modo edição"
            adicionarTarefaBotao.textContent = 'Adicionar tarefa';//Coloca o texto do botão para o padrão(Adicionar tarefa)

        } else {//Se não acrescenta na lista uma nova tarefa
            tarefas.push({
                titulo: tituloTarefa,
                descricao: descricaoTarefa,
                categoria: categoriaTarefa,
                prioridade: prioridade
            });
        }

        //Salva as alterações
        salvarTarefas(tarefas);
        
        //Recarrega a tarefa
        renderizarTabela();
        
        //Limpa o formulário após adicionar/editar
        mostrarAlerta('Tarefa adicionada com sucesso!');
        limparFormulario();

        setTimeout(() => {
            mostrarSessao('table');
        }, 1500);
    });

    //Botão de limpar formulario quando clicado irá executar isso
    limpaFormulario.addEventListener('click', function (event) {
        //Evita que a página recarregue quando o botão é clicado
        event.preventDefault();
        
        //Limpa o formulario
        limparFormulario();
    });

    function mostrarAlerta(mensagem) {
        taskAlert.textContent = mensagem;
        taskAlert.classList.add('show');

        setTimeout(() => {
            taskAlert.classList.remove('show');
        }, 4000);
    }

    //Função de editar uma linha
    //Recebe o indice da linha que será mudada
    function editarTarefa(index) {
        const tarefa = getTarefas()[index];

        linhaEditada = index;

        //Coloca as valor nas inputs do forms para que o usuário continue apartir dali
        tituloTarefaInput.value = tarefa.titulo;
        descricaoTarefaInput.value = tarefa.descricao;
        categoriaSelecionada.value = tarefa.categoria;

        prioridadeRadios.forEach(radio => {
            radio.checked = radio.value === tarefa.prioridade;
        });

        //Muda o texto do botão para o usuário entender que está em modo de alteração
        adicionarTarefaBotao.textContent = 'Salvar Alterações';
        
        //Volta a mostrar a sessão d formulario
        mostrarSessao('forms');
    }
    
    //função para deletar tarefa
    //Recebe o indice da linha que será excluida
    function deletarTarefa(index) {
        const tarefas = getTarefas();

        if (!tarefas[index]) return;

        deleteModal.classList.add('show');

        confirmDelete.onclick = () => {
            tarefas.splice(index, 1);
            salvarTarefas(tarefas);
            renderizarTabela();

            deleteModal.classList.remove('show');
            mostrarAlerta('Tarefa excluída com sucesso!');
        };

        cancelDelete.onclick = () => {
            deleteModal.classList.remove('show');
        };
    }

    //Recria a tabela na sessão de tabela com base no que há na local storage
    function renderizarTabela() {
        const tarefas = getTarefas();
        tarefasTable.innerHTML = '';

        tarefas.forEach((tarefa, index) => {
            const novaLinha = tarefasTable.insertRow();

            const checkboxCell = novaLinha.insertCell();
            checkboxCell.classList.add('checkbox-column');
            checkboxCell.innerHTML = `<input type="checkbox">`;

            const tituloCell = novaLinha.insertCell();
            tituloCell.textContent = tarefa.titulo;
            tituloCell.title = tarefa.titulo;

            const descricaoCell = novaLinha.insertCell();
            descricaoCell.textContent = tarefa.descricao;
            descricaoCell.title = tarefa.descricao;

            const categoriaCell = novaLinha.insertCell();
            categoriaCell.textContent = tarefa.categoria;
            categoriaCell.title = tarefa.categoria;

            const prioridadeCell = novaLinha.insertCell();
            prioridadeCell.textContent = tarefa.prioridade;
            prioridadeCell.title = tarefa.prioridade;

            const celulaAcoes = novaLinha.insertCell();
            celulaAcoes.innerHTML = `
            <button class="delete-task-btn functions-button-row" aria-label="Excluir tarefa" title="Excluir tarefa">
                <img src="../excluir.svg" alt="">
            </button>
            <button class="edit-task-btn functions-button-row">Editar</button>
            
        `;

            celulaAcoes.querySelector('.edit-task-btn').addEventListener('click', () => editarTarefa(index));
            const btnDelete = celulaAcoes.querySelector('.delete-task-btn');

            btnDelete.addEventListener('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                deletarTarefa(index);
            });
        });
    }

    //função para limpar o formulario onde reseta todos os campos
    function limparFormulario() {
        tituloTarefaInput.value = '';
        descricaoTarefaInput.value = '';
        categoriaSelecionada.value = '';
        prioridadeRadios.forEach(radio => radio.checked = false);
        tituloTarefaInput.focus();
    }

    //Fução que será executada quando o usuario clicar para mostrar o formulario pela navbar
    navAdicionar.addEventListener('click', function () {
        //Redefine para o modo normal(não edição)
        if (linhaEditada) {
            linhaEditada.classList.remove('editing');
            linhaEditada = null;
            adicionarTarefaBotao.textContent = 'Adicionar tarefa';
            limparFormulario();
        }
        mostrarSessao('forms');
    });

    //Padrões de carregamento de página
    carregarUsuario();
    renderizarTabela()
}

//Carrega o nome de usuario da local storage para ser colocado no topo da página
function carregarUsuario() {
    var usuario = sessionStorage.getItem("usuario");
    const nomeEl = document.getElementById("nome-usuario");
    if (usuario) {
        if (nomeEl) {
            nomeEl.innerText = usuario;
        }
    } else {
        nomeEl.innerText = "Visitante";
    }
}

window.addEventListener("beforeunload", function () {
    sessionStorage.removeItem("usuario")
});

fetch('../html/forms.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('forms-section').innerHTML = data;

        fetch('../html/table.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('table-section').innerHTML = data;

                fetch('../html/header.html')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('header').innerHTML = data;

                        // Fetch do Footer adicionado aqui
                        fetch('../html/footer.html')
                            .then(response => response.text())
                            .then(data => {
                                document.querySelector('footer').innerHTML = data;

                                // Inicia o JS apenas quando tudo (forms, table, header e footer) estiver carregado
                                iniciarJS();
                            })
                            .catch(error => console.error('Erro ao carregar footer:', error));

                    })
                    .catch(error => console.error('Erro ao carregar header:', error));
            })
            .catch(error => console.error('Erro ao carregar table:', error));
    })
    .catch(error => console.error('Erro ao carregar forms:', error));

