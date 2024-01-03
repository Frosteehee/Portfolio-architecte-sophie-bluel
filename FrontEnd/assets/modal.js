// Importez les fonctions
//import { createProjectFormData, postApi } from './modal.js';



//Variables globales
const modal = document.querySelector(".modal "); //recupere le modal*
const modal1 = document.querySelector(".modal1"); //recupere le modal1*
const modal2 = document.querySelector(".modal2"); //recupere le modal2*
const modalContent = document.querySelector(".modal_content");
const galleryModal = document.querySelector(".galleryModal");
const openBtn = document.getElementById("modal_open");//recupere le bouton qui ouvre le modal
const closeBtn = document.getElementsByClassName("closeBtn")[0];//recupere le span qui ferme le modal
const logOutBtn = document.getElementById("logOut");//recupere le bouton de deconnexion
const token = window.localStorage.getItem("token");//recupere le token du local storage
const modalProjects  =  getGalleryProjects();//recupere les projets de la galerie depuis l'API
//const "token"= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"


function main(){
 /* getGalleryProjects();
 displayProjectsModal();
    switchModal();
 */

}



//************** */ ouvrir et fermer la modale
openBtn.onclick = function() { 
  modal.style.display = "block"; 
modal1.style.display = "block";//au clic il n'y a toujours que la modal1 qui s'ouvre
modal2.style.display = "none";
}

closeBtn.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
 // if (event.target == modal) {
   // modal.style.display = "none"; //fermer la modale en cliquant en dehors du bouton 
 // }

  if (event.target == galleryModal) {
    galleryModal.style.display = "none";
  }
}

//recuperer les projets de la galerie depuis l'API

async function getGalleryProjects() {
  const response = await fetch ("http://localhost:5678/api/works");
return await response.json();

}
getGalleryProjects();



//**********************afficher les projets dans la modale

async function displayProjectsModal(){

const modalProjects = await getGalleryProjects();
for (let i = 0; i < modalProjects.length; i++) {

  // figure
const figure = modalProjects[i];
 const projectFigure = document.createElement("figure");
  projectFigure.dataset.id = "Figure"+ i;
  projectFigure.classList.add("projectFigureModal");

  //icone delete
const containerDelete = document.createElement('div');
  containerDelete.classList.add("containerDelete");
const deleteIcon = document.createElement('img');
    deleteIcon.src="./assets/icons/trash-can-solid.svg";
    deleteIcon.classList.add("deleteIcon")    ;
    
// Image
const imageFigure = document.createElement("img");
  imageFigure.src = figure.imageUrl;
  imageFigure.classList.add("imgFigureModal");

  //parents/enfants
projectFigure.appendChild(containerDelete);
galleryModal.appendChild(projectFigure);
projectFigure.appendChild(imageFigure);
containerDelete.appendChild(deleteIcon);

}
console.log(modalProjects);
}

displayProjectsModal();




//*********************Acceder à modal2 depuis modal1



const addProjectBtn = document.getElementById('addProjectBtn') //

    addProjectBtn.addEventListener ("click", switchModal)
function switchModal() {
    const modal1 = document.querySelector('.modal1')
    const modal2 = document.querySelector('.modal2')

    if (modal1.style.display === 'block') {
        modal1.style.display = 'none'
        modal2.style.display = 'flex'
    } else {
        modal1.style.display = 'block'
        modal2.style.display = 'none'
    }
}
    switchModal();

//recuperer les categories depuis l'API pour le menu deroulant

async function getCategories(){
  const projectsCategories = await fetch ("http://localhost:5678/api/categories");
  return await projectsCategories.json();
}

const select = document.getElementById('projectCategories');
const categories = getCategories();

categories.then((data) => {
  data.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.innerText = category.name;
    select.appendChild(option);
  });
});




