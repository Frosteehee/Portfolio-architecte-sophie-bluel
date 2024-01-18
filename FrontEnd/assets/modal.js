// ******************************************************************************
// ***************************** FONCTION MODALE ******************************
// ******************************************************************************


//Variables globales
const token = window.localStorage.getItem("token");//recupere le token du local storage
const modal = document.querySelector(".modal "); //recupere le modal*
const modal1 = document.querySelector(".modal1"); //recupere le modal1*
const modal2 = document.querySelector(".modal2"); //recupere le modal2*
const modalContent = document.querySelector(".modal_content");//recupere le contenu du modal
const galleryModal = document.querySelector(".galleryModal");//recupere la div qui contient les projets de la galerie
const openBtn = document.getElementById("modal_open");//recupere le bouton qui ouvre le modal
const closeBtn = document.getElementsByClassName("closeBtn")[0];//recupere le span qui ferme le modal
const logOutBtn = document.getElementById("logOut");//recupere le bouton de deconnexion
const previewContainer = document.getElementById('previewImageContainer');//recupere la div qui contient l'image preview
const addProjectInput = document.querySelector('#addProjectInput');//recupere l'input qui permet d'ajouter un projet
const nameError = document.getElementById('nameError'); // Ajout d'une référence à nameError
const categoriesError = document.getElementById('categoriesError'); // Ajout d'une référence à categoriesError
//const modalProjects  =  getGalleryProjects();


function main(){
  getGalleryProjects();
  displayProjectsModal();
  deleteProject();
  deleteFigureFromAPI();
  switchModal();
  switchModal2();
  getCategories();
  uploadProject();
}



/////////////////////// OUVRIR ET FERMER LA MODALE /////////////////////////////

openBtn.onclick = function() { 
modal.style.display = "block"; 
modal1.style.display = "flex";//au clic il n'y a toujours que la modal1 qui s'ouvre
modal2.style.display = "none";
}

// au clic sur la croix, la modale se ferme
closeBtn.onclick = function() {
modal.style.display = "none";
window.location.reload();
}

// au clic en dehors de la modale, la modale se ferme
window.onclick = function(event) { 
  if (event.target == modal) {
   modal.style.display = "none";
   window.location.reload();
  }
}




////////////// RECUPERER LES PROJETS DEPUIS L'API ////////////////

async function getGalleryProjects() {
  const response = await fetch ("http://localhost:5678/api/works");
return await response.json();
}
getGalleryProjects();



//////////////// AFFICHER LES PROJETS DANS LA MODALE ///////////////////////////


async function displayProjectsModal(){

  const modalProjects = await getGalleryProjects();
  
  for (let i = 0; i < modalProjects.length; i++) {
  
    // Création de Figure
    const figure = modalProjects[i];
    const projectFigure = document.createElement("figure");
    projectFigure.dataset.id = "Figure"+ i;
    projectFigure.classList.add("projectFigureModal");
  
    //Création de l'icône de suppression
    const containerDelete = document.createElement('div');
    containerDelete.classList.add("containerDelete");
    const deleteIcon = document.createElement('img');
    deleteIcon.src="./assets/icons/trash-can-solid.svg";
    deleteIcon.classList.add("deleteIcon");

    //Ajout d'un id unique à chaque icone de suppression
    deleteIcon.id = `deleteIcon-${i}`;
    deleteIcon.alt = "icone suppression";

/**
   //Remarque: si j'upload plusieurs fois la meme image, en cliquant sur l'icone de suppression d'une de ces images
   //c'est la derniere image qui est supprimee
**/
    
    // Supprimer un projet de la galerie depuis la modale en cliquant sur l'icône de suppression
    deleteIcon.addEventListener('click', async (event) => {
    // Supprime la figure de l'API
    await deleteFigureFromAPI(figure.id);
    // Supprime la figure du DOM
    projectFigure.remove();
    //reload la page pour afficher les changements
    //window.location.reload();
});
  
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
}

displayProjectsModal();


////////////////// SUPPRIMER UN PROJET DEPUIS L'API //////////////////////

deleteFigureFromAPI = async (id) => {

  const token = window.localStorage.getItem("token")//.replace(/['"]+/g, '');
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: ''
    });

  if (!response.ok) {
    throw new Error('Request failed');

  } else {
    console.log('Photo supprimée avec succès');
    //reload la page pour afficher les changements
   // window.location.reload();
  }
}


/////////////////////// AJOUTER UN PROJET ///////////////////////////////////////


//Si je clique sur le bouton "ajouter un projet", la modal2 s'affiche et la modal1 disparait
const addProjectBtn = document.getElementById('addProjectBtn') //
    addProjectBtn.addEventListener ("click", switchModal)
function switchModal() {

    if (modal1.style.display === 'flex') {
        modal1.style.display = 'none'
        modal2.style.display = 'flex'
    } else {
        modal1.style.display = 'flex'
        modal2.style.display = 'none'
    }
}

switchModal();

//fleche retour pour revenir à la modal1

const arrowBack = document.getElementById('arrowBack')                       //
    arrowBack.addEventListener ("click", switchModal2)
function switchModal2() {
    const modal1 = document.querySelector('.modal1')
    const modal2 = document.querySelector('.modal2')
  
   

    if (modal2.style.display === 'flex') {
        modal2.style.display = 'none'
        modal1.style.display = 'flex'
        nameError.innerHTML = "";
        categoriesError.innerHTML = "";
        formUpload.reset();
    

    } else {
        modal2.style.display = 'flex'
        modal1.style.display = 'none'
    }
}


//recuperer les categories depuis l'API pour le menu deroulant
 
async function getCategories(){
  const projectsCategories = await fetch ("http://localhost:5678/api/categories");
  return await projectsCategories.json();
}
const select = document.getElementById('projectCategories');
const categories = getCategories();
categories.then((data) => {

  // Créer une option vide pour le menu déroulant
  const emptyOption = document.createElement('option');
  emptyOption.value = "";
  emptyOption.innerText = "";
  select.appendChild(emptyOption);

  // Ajouter les autres catégories
  data.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.innerText = category.name;
    select.appendChild(option);
  });
});

//////////upload et preview de l'image

//DOMContentloaded pour que le script s'execute quand le DOM est charge
document.addEventListener("DOMContentLoaded", function () {
 
/////// Preview image

  addProjectInput.addEventListener('change', function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        const img = document.createElement('img');
        img.src = this.result;
        previewContainer.innerHTML = '';
        previewContainer.appendChild(img);
        img.classList.add("previewImage");
      });
      reader.readAsDataURL(selectedFile);
    }
  });


///////// UPLOAD PROJECT

  async function uploadProject(event){
   event.preventDefault();//empeche le comportement par defaut du navigateur

    const projectName = document.getElementById("projectName").value;
    const projectCategory = document.getElementById("projectCategories").value;
    const selectedFile = addProjectInput.files[0];

  // Verifie si tous les champs sont remplis
    if (selectedFile) {
      const token = window.localStorage.getItem("token").replace(/['"]+/g, '');
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", projectName);
      formData.append("category", projectCategory);
    
      if (!projectName) { // Vérifie si un nom de projet est renseigné
       // alert("Veuillez ajouter un titre");
        nameError.innerHTML = "Veuillez ajouter un titre";
        return;
      }

      if (!selectedFile) { // Vérifie si un fichier est sélectionné
        alert("Veuillez ajouter un fichier");
        nameError.innerHTML = "Veuillez ajouter un fichier";
        return;
      }
     if (!projectCategory) { // Vérifie si une catégorie est sélectionnée
     //   alert("Veuillez ajouter une catégorie");
        categoriesError.innerHTML = "Veuillez ajouter une catégorie";
       return;
      }

  //fetch POST request
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
         console.log("it works! youhouuuu");
         //reload la page pour afficher les changements
          window.location.reload();
        }
      } catch (error) {
        nameError.innerHTML ="Veuillez remplir tous les champs";
       // console.error("Nope", error);
      } 
    }}

  //upload form
 const formUpload = document.querySelector(".form_upload");
 if (formUpload) {
  formUpload.addEventListener("submit", uploadProject);
} else {
  console.error("Nope");
}}
);

///tant que le formulaire n'est pas rempli, le bouton de validation est desactive///


const validateBtn = document.getElementById('validateBtn');
const formUpload = document.querySelector('.form_upload'); 
const projectName = document.getElementById("projectName")
const projectCategory = document.getElementById("projectCategories")

//validateBtn.disabled = true;//bouton desactive par defaut

// Fonction pour vérifier si tous les champs sont remplis
function checkInputs() {

  // Si tous les champs sont ok validateBtn est activé
  if (projectName.value && projectCategory.value) {           
    validateBtn.disabled = false;
    validateBtn.classList.remove('button__off');
    validateBtn.classList.add('validateBtn');  

  } else {
    // Sinon,valideBtn est désactivé
   // validateBtn.disabled = true;
    validateBtn.classList.remove('validateBtn');
    validateBtn.classList.add('button__off');
  }
}
projectName.addEventListener('input', checkInputs);
projectCategory.addEventListener('input', checkInputs);


