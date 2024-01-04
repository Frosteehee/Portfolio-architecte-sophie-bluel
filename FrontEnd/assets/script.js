
//variables globales

const sectionGallery = document.querySelector(".gallery");
const imageFigure = document.createElement("img");
const titleFigure = document.createElement("figcaption");
const projectFigure = document.createElement("figure");
const portfolioDisplay = document.getElementById("#portfolio");
const sectionFilters = document.querySelector(".filters");
const projects =  getGalleryProjects();
const filterProjects = document.createElement("button");
const projectsCategories = getCategories();
//const buttons = document.querySelectorAll(".filters button");


let index = 0;

//Fonctions 

function main(){
  getGalleryProjects();
  displayProjects();
 displayCategories();
 filterProjectsByCategory();
}


//API FETCH

async function getGalleryProjects(){
  const response = await fetch("http://localhost:5678/api/works");
 return await response.json();
  }

getGalleryProjects();



//Fonction pour afficher les projets de la galerie

async function displayProjects(){
  const projects = await getGalleryProjects();
  for (let i = 0; i < projects.length; i++) {//boucle for pour parcourir les donnees de l'api
    const figure = projects [i];
    const sectionGallery = document.querySelector(".gallery");
    const projectFigure = document.createElement("figure");
    projectFigure.dataset.id = projects[i].id; 

    const imageFigure = document.createElement("img");
    imageFigure.src = figure.imageUrl; 

    const titleFigure = document.createElement("figcaption");
    titleFigure.innerText = figure.title ?? "(aucun titre)";
   
    sectionGallery.appendChild(projectFigure);
    projectFigure.appendChild(imageFigure);
    projectFigure.appendChild(titleFigure);

  }

}
displayProjects();

/****************************** FILTRES ************************************/

//Fonction pour afficher les boutons de filtre

async function getCategories(){
  const projectsCategories = await fetch ("http://localhost:5678/api/categories");
  return await projectsCategories.json();
}

async function displayCategories(){
  const projectsCategories = await getCategories();
  console.log(projectsCategories);

  projectsCategories.forEach((category) => {
    const sectionFilters = document.querySelector(".filters");
    const filterProjects = document.createElement("button");

    //filterProjects.classList.add(".button");// Ajout de la classe buttonAllWorks à button
    filterProjects.textContent = category.name;
    filterProjects.id = category.id;
    sectionFilters.appendChild(filterProjects);
  });

}
displayCategories();

//Fonction pour filtrer les projets par catégorie


async function filterProjectsByCategory(categoryId){//fonction pour filtrer les projets par catégorie
  const projects = await getGalleryProjects();//recuperation des données de l'api
  const buttons = document.querySelectorAll(".filters button");//recuperation des boutons
buttons.forEach(button => {//boucle pour parcourir les boutons

  button.addEventListener("click", (e) => {//ajout d'un event listener sur chaque bouton
  button = e.target.id;//recuperation de l'id du bouton cliqué
  sectionGallery.innerHTML = "";//vider la section gallery^
  console.log(button);


if (button !== "0") {//si l'id du bouton est différent de 0 ("tous")
const galleryFiltered = projects.filter((project) => {//filtrer les projets par catégorie
  return project.categoryId == button;//retourner les projets dont l'id de la catégorie correspond à l'id du bouton cliqué

}
);
console.log(galleryFiltered);


//quand je fais un For Each cela me creer autant d img/figure que de projets dans chaque categorie
for (let i = 0; i < galleryFiltered.length; i++) {
  const figure = galleryFiltered[i];
  const sectionGallery = document.querySelector(".gallery");
  const projectFigure = document.createElement("figure");
  projectFigure.dataset.id = galleryFiltered[i].id;

  const imageFigure = document.createElement("img");
  imageFigure.src = figure.imageUrl; 
  const titleFigure = document.createElement("figcaption");
  titleFigure.innerText = figure.title ?? "(aucun titre)";
 
  sectionGallery.appendChild(projectFigure);
  projectFigure.appendChild(imageFigure);
  projectFigure.appendChild(titleFigure);
}
}
//si  je clique sur le bouton "tous les projets" cela me renvoie tous les projets
else {
displayProjects();

}
  });

  }
  )}

filterProjectsByCategory();



function logOut() {//fonction pour se deconnecter
  const logOutBtn = document.getElementById("logOut");//recupere le bouton


  if (window.localStorage.getItem("token")) {//si le token est dans le local storage
    logOutBtn.innerHTML = "logout";//changer le texte du bouton

    logOutBtn.addEventListener("click", () => {//ajouter un event listener sur le bouton
      logOutBtn.href = window.location.href;//rediriger vers la page d'accueil
      window.localStorage.removeItem("token");//supprimer le token du local storage
    });

    //   localStorage.clear(); 

  }
}

logOut();


//cette fonction permet d'afficher la vue admin si l'utilisateur est connecté, en cachant adminView
// et en supprimant les filtres de la page.
function displayAdminView() {//fonction pour afficher la vue admin
const adminView = document.querySelectorAll(".adminView");//recuperer la div admin view
//si l utilisateur est connecté
if (window.localStorage.getItem("token")) {//si le token est dans le local storage
 //adminView.style.display = "flex";//display ne
// const sectionFilters = displayCategories();
//sectionFilters.remove();
sectionFilters.style.display = "none";
} 
//si l utilisateur n est pas connecté
if (!window.localStorage.getItem("token")){//si le token n est pas dans le local storage

  adminView.forEach((adminView) => { //boucle pour parcourir la div admin view, pourquoi forEach? sans = adminView is not defined
    adminView.style.display = "none";
  });
  }

 


}
displayAdminView();

