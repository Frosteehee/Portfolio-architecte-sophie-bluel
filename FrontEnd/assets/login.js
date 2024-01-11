

//scenario :
//on attend que le DOM soit chargé
//on récupère le formulaire
//on écoute l'évènement submit sur le formulaire
////on empêche le comportement par défaut du formulaire
//on récupère les valeurs des champs Email et Password
//on crée un objet JS avec les valeurs des champs
//on indique l'URL de l'API
//on indique la méthode
//on indique les headers
//on indique le type de contenu
//on convertit l'objet JS en JSON
//on récupère la réponse de l'API
//on vérifie si la réponse est ok
//on récupère la réponse en JSON
//si on a un token
//on le stocke dans une variable
//on le stocke dans le local storage
//on redirige vers la page d'accueil
//on affiche un message
//sinon
//on affiche un message
//fin de la condition

// où est stocké le token ?
const email = document.querySelector('#email').value;
const password = document.querySelector('#password').value;
const user = { email, password};
const logOutBtn = document.getElementById("logOut");
const form = document.querySelector('form');
const token = window.localStorage.token 
//set item 


function main(){
    // logIn() ;
        logOut();
}

async function logIn() {
    document.addEventListener('click', () => {
      //document.addEventListener('DOMContentLoaded', () => {
        window.localStorage.getItem("token");
        const form = document.querySelector('form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const user = {
                email,
                password
            };
console.log(user);
try {
          const response = await fetch("http://localhost:5678/api/users/login", {
          method : 'POST',
          headers : {
                'Content-Type': 'application/json'
            },
             body : JSON.stringify(user)
          });
console.log(response);


if (response.status === 200) {
    //connection ok on recup le token
    const data = await response.json(); //recupere la reponse en json
    let idtoken = data.token; //recupere le token
    window.localStorage.setItem("token",idtoken) //stock token dans localStorage
    window.location.href="index.html" //Retour sur la page d'accueil
           // if (response.ok) {
             //   const data = await response.json();
             //  if (data.token) {
                 //   const token = data.token;
                    //const token = window.localStorage.token; // ??
               //     window.localStorage.setItem('token', data.token);
                 //   window.localStorage.logedIn = true;
                   // window.location.href = './index.html';
                    alert("Vous êtes bien connecté");

            } else {

                alert("nope");
                document.getElementById("nameError").innerHTML =
                "Erreur dans l’identifiant ou le mot de passe"

            }

            console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    }

    )})}
logIn();


// travailler sur le LogOut

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


//
  //function logout() {
    //let login = document.getElementById("logOut");
    //login.innerHTML = "logout";
    //login.setAttribute("href", "#");
    //login.addEventListener("click", function logout() {
     // window.localStorage.removeItem("token");
      //window.location.href = "./index.html";
    //});
  //}
  //logout  ();
