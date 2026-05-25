// Remove erro do campo
function limparErro(idCampo) {

    const campo = document.getElementById(idCampo);

    if (!campo) return;

    const grupo = campo.parentElement;

    grupo.classList.remove("error");

    const erroTexto = grupo.querySelector(".error-text");

    if (erroTexto) {
        erroTexto.innerText = "";
    }

    campo.removeAttribute("aria-invalid");
}


// Mostra erro no campo
function erro(mensagem, campos = []) {

    campos.forEach(function (idCampo) {

        const campo = document.getElementById(idCampo);

        if (!campo) return;

        const grupo = campo.parentElement;

        // adiciona estado de erro
        grupo.classList.add("error");

        // acessibilidade
        campo.setAttribute("aria-invalid", "true");

        // mensagem
        const erroTexto = grupo.querySelector(".error-text");

        if (erroTexto) {
            erroTexto.innerText = mensagem;
        }

        // limpa ao digitar
        campo.addEventListener("input", function () {
            limparErro(idCampo);
        }, { once: true });

        campo.addEventListener("change", function () {
            limparErro(idCampo);
        }, { once: true });
        
    });

}
