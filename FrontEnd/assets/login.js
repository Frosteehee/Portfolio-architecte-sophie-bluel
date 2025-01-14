
// ******************************************************************************
// ****************************** LOG IN // LOG OUT ******************************
// ******************************************************************************



//Variables globales
const email = document.querySelector('#email').value;
const password = document.querySelector('#password').value;
const user = { email, password};
const logOutBtn = document.getElementById("logOut");
const form = document.querySelector('form');
const token = window.localStorage.token 


//Main function

function main(){
    logIn() ;
    logOut();
}


/////Fonction pour se connecter

async function logIn() {
    document.addEventListener('click', () => {
        window.localStorage.getItem("token");
        const form = document.querySelector('form');
        form.addEventListener('submit', async (e) => {//ajout d'un event listener sur le formulaire
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const user = {
                email,
                password
            };
        //console.log(user);

///////envoit de la requete API

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
    //connexion ok on recup le token
        const data = await response.json(); //recupere la reponse en json
        let idtoken = data.token; //recupere le token
        window.localStorage.setItem("token",idtoken) //stock token dans localStorage
        window.location.href="index.html" //Retour sur la page d'accueil
    //alert("Vous êtes bien connecté");

     } else {
        //alert("nope");
         document.getElementById("nameError").innerHTML =
        "Erreur dans l’identifiant ou le mot de passe"
     }
   // console.log(response);
     }  
    catch (error) {
        console.log(error);
    }})
})}

logIn();


//Fonction pour se deconnecter 

function logOut() {//fonction pour se deconnecter
    const logOutBtn = document.getElementById("logOut");
    if (window.localStorage.getItem("token")) {
      logOutBtn.innerHTML = "logout";
      logOutBtn.addEventListener("click", () => {
      logOutBtn.href = window.location.href;
      window.localStorage.removeItem("token");
      });
    }
  }

  logOut();


