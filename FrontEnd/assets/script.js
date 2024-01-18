
// ******************************************************************************
// ****************************** PAGE D'ACCUEIL ******************************
// ******************************************************************************


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

let index = 0;

//Fonctions 

function main(){
  getGalleryProjects();
  displayProjects();
  displayCategories();
  filterProjectsByCategory();
  logOut();
  displayAdminView();
}

//////////////////////////////////////////////// GALERIE ///////////////////////////////////////////////


//////// Fonction pour recuperer les projets de la galerie depuis l'api

async function getGalleryProjects(){
  const response = await fetch("http://localhost:5678/api/works");
 return await response.json();
  }
getGalleryProjects();



//////// Fonction pour afficher les projets de la galerie

async function displayProjects(){
  const projects = await getGalleryProjects();
  //boucle for pour parcourir les donnees de l'api et créer une figure pour chaque projet
  for (let i = 0; i < projects.length; i++) {
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

////////////////////////////////////////////// FILTRES ////////////////////////////////////////////////

///// Fonction pour créer et afficher les boutons de filtre

//recuperer les categories depuis l'api
async function getCategories(){
  const projectsCategories = await fetch ("http://localhost:5678/api/categories");
  return await projectsCategories.json();
}

//fonction pour afficher les boutons de filtre
async function displayCategories(){
    const projectsCategories = await getCategories();
    projectsCategories.forEach((category) => {
    const sectionFilters = document.querySelector(".filters");
    const filterProjects = document.createElement("button");

    filterProjects.textContent = category.name;
    filterProjects.id = category.id;
    sectionFilters.appendChild(filterProjects);
  });
}
displayCategories();


////// Fonction pour filtrer les projets par catégorie


async function filterProjectsByCategory(){
  const projects = await getGalleryProjects();
  const buttons = document.querySelectorAll(".filters button");

  //boucle pour parcourir les boutons
  buttons.forEach(button => {
  //ajout d'un event listener sur chaque bouton
  button.addEventListener("click", (e) => {
  //recuperation de l'id du bouton cliqué
  button = e.target.id;
  //vider la section gallery
  sectionGallery.innerHTML = "";

  //si l'id du bouton est différent de 0 ("tous")
if (button !== "0") {
  //filtrer les projets par catégorie
  const galleryFiltered = projects.filter((project) => {
  //retourner les projets dont l'id de la catégorie correspond à l'id du bouton cliqué
  return project.categoryId == button;
}
);

//** remarque :quand je fais un For Each cela me creer autant d img/figure que de projets dans chaque categorie

//boucle for pour parcourir les donnees de l'api et créer une figure pour chaque projet
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
//si je clique sur le bouton "tous" cela me renvoie tous les projets
else {
displayProjects();

}});
})}

filterProjectsByCategory();





/////////////////////////////////////////// ADMIN ////////////////////////////////////////////////


//////Fonction pour se deconnecter 

function logOut() {
  const logOutBtn = document.getElementById("logOut");

  if (window.localStorage.getItem("token")) {
    logOutBtn.innerHTML = "logout";

    logOutBtn.addEventListener("click", () => {
      logOutBtn.href = window.location.href;
      window.localStorage.removeItem("token");
    });
  }}

logOut();


//// Fonction pour afficher la vue admin si l'utilisateur est connecté
function displayAdminView() {
const adminView = document.querySelectorAll(".adminView");

//si l utilisateur est connecté
if (window.localStorage.getItem("token")) {
  //enleve les filtres
sectionFilters.style.display = "none";
} 
//si l utilisateur n est pas connecté
if (!window.localStorage.getItem("token")){
  adminView.forEach((adminView) => { //
    // Remarque: pourquoi forEach? sans = adminView is not defined
    adminView.style.display = "none";
  });
  }}

displayAdminView();
