
const checkTokenLogin = () => {
    const tokenAuth = localStorage.getItem("token");
    const adminBar = document.getElementById("admin_bar");
    const sectionFilters = document.querySelector(".filters");
    const modifierBtn = document.getElementById("add_project-btn");

}
checkTokenLogin();

function logOut() {//fonction pour se deconnecter
    const logOutBtn = document.getElementById("logOut");//recupere le bouton

  
    if (window.localStorage.getItem("token")) {//si le token est dans le local storage
      logOutBtn.innerHTML = "logout";//changer le texte du bouton
  
      logOutBtn.addEventListener("click", () => {//ajouter un event listener sur le bouton
        logOutBtn.href = window.location.href;//rediriger vers la page d'accueil
        window.localStorage.removeItem("token");//supprimer le token du local storage
      });
    }
  }
  
  logOut();





