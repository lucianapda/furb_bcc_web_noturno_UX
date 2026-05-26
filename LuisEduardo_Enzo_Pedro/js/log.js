const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const login = document.getElementById("login");
const lembreMe = document.getElementById("lembre-me");

const validarCampo = (e) => {
    e.preventDefault();

    if (usuario.value === "admin" && senha.value === "admin") {
        sessionStorage.setItem("usuario", usuario.value)

        window.open("index.html", "_self");

        if (lembreMe.checked) {
            localStorage.setItem("usuario", usuario.value);
            localStorage.setItem("senha", senha.value);
        } else {
            localStorage.clear();
        }
    } else {
         usuario.style.borderColor = "#ff0000";
         senha.style.borderColor = "#ff0000"; 
         login.disabled = true;

         // Mensagem de erro
         senha.insertAdjacentHTML("afterend", `
             <div id="warning" class="mb-md" style="font-size: 11px; color: #ff0000">
                 Usuário e/ou senha incorretos
             </div>
         `);

         // Ícone dentro do campo de usuário
        if (!document.getElementById("error-icon")) {
        usuario.parentElement.insertAdjacentHTML("beforeend", `
            <img src="img/icons/error.png" alt="Erro" class="error-icon-usuario" id="error-icon-usuario">
        `);}
    
         // Ícone dentro do campo de senha
         if (!document.getElementById("error-icon")) {
             senha.parentElement.insertAdjacentHTML("beforeend", `
                 <img src="img/icons/error.png" alt="Erro" class="error-icon" id="error-icon">
             `);
         }
         
     
         setTimeout(() => {
             usuario.style.borderColor = "white";
             senha.style.borderColor = "white";
             login.disabled = false;

             const warning = document.getElementById("warning");
             if (warning) warning.remove();

             const iconUsuario = document.getElementById("error-icon-usuario");
             if (iconUsuario) iconUsuario.remove();
                
             const icon = document.getElementById("error-icon");
             if (icon) icon.remove();
         }, 3000);
}

};

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("usuario") && localStorage.getItem("senha")) {
        usuario.value = localStorage.getItem("usuario");
        senha.value = localStorage.getItem("senha");
    }
})

login.addEventListener("click", (e) => {
    validarCampo(e);
}); 