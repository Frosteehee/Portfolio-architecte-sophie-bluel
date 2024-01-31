// ******************************************************************************
// ***************************** FONCTION MODALE ******************************
// ******************************************************************************


//Variables globales
const token = window.localStorage.getItem("token").replace(/['"]+/g, '');
const modal = document.querySelector(".modal "); 
const modal1 = document.querySelector(".modal1"); 
const modal2 = document.querySelector(".modal2"); 
const modalContent = document.querySelector(".modal_content");
const galleryModal = document.querySelector(".galleryModal");
const openBtn = document.getElementById("modal_open");
const closeBtn = document.getElementsByClassName("closeBtn")[0];
const logOutBtn = document.getElementById("logOut");
const previewContainer = document.getElementById('previewImageContainer');
const addProjectInput = document.querySelector('#addProjectInput');
const nameError = document.getElementById('nameError'); 
const categoriesError = document.getElementById('categoriesError'); 
const uploadImgContainer = document.getElementById('UploadImageContainer');
const addProjectLogo = document.querySelector('addProjectLogo');
const addProjectLabel = document.querySelector('addProjectLabel');


function main(){
  getGalleryProjects();
  displayProjectsModal();
  deleteProject();
  deleteFigureFromAPI();
  switchModal();
  switchModal2();
  getCategories();
  uploadProject();
  checkInputs();
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

}

// au clic en dehors de la modale, la modale se ferme
window.onclick = function(event) { 
  if (event.target == modal) {
   modal.style.display = "none";
 
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
const deleteSuccess = document.getElementById('deleteSuccess');
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
  }
  else {
    console.log('Photo supprimée avec succès');
    deleteSuccess.innerHTML = "Photo supprimée avec succès";
    sectionGallery.innerHTML = "";
    await displayProjects();

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

const arrowBack = document.getElementById('arrowBack')                       

arrowBack.addEventListener ("click", switchModal2)
function switchModal2() {
    const modal1 = document.querySelector('.modal1')
    const modal2 = document.querySelector('.modal2')
  
    if (modal2.style.display === 'flex') {
        modal2.style.display = 'none'
        modal1.style.display = 'flex'
           nameError.innerHTML = "";
           categoriesError.innerHTML = "";
           deleteSuccess.innerHTML = "";
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

document.addEventListener("DOMContentLoaded", function () {
 
/////// Preview image

  addProjectInput.addEventListener('change', function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        const imgPreview = document.createElement('img');
        imgPreview.src = this.result;
        previewContainer.innerHTML = '';
        previewContainer.appendChild(imgPreview);
        imgPreview.classList.add("previewImage");
      });
      reader.readAsDataURL(selectedFile);
      
    }
  });
  
  function displayPreviewContainer() {
    previewContainer.innerHTML =  `     <span><img src="assets/icons/addProject_Img.svg"  class="addProjectLogo" alt="modalLogo"></span>
    <label for="addProjectInput" class="addProjectLabel">+ Ajouter une photo</label>
    <input type="file" name="addProjectInput" id="addProjectInput" class="hidden">
    <span>jpg, png : 4mo max</span>`;
  }

  

///////// UPLOAD PROJECT

  async function uploadProject(event){
   event.preventDefault();

    const projectName = document.getElementById("projectName").value;
    const projectCategory = document.getElementById("projectCategories").value;
    const selectedFile = addProjectInput.files[0];

  // Verifie si tous les champs sont remplis
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", projectName);
      formData.append("category", projectCategory);
    
      if (!projectName) { // Vérifie si un nom de projet est renseigné
        nameError.innerHTML = "Veuillez ajouter un titre";
        return;
      }

      if (!selectedFile) { // Vérifie si un fichier est sélectionné
        nameError.innerHTML = "Veuillez ajouter un fichier";
        return;
      }
     if (!projectCategory) { // Vérifie si une catégorie est sélectionnée
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
      
         console.log("it works! youhouuuu");
         nameError.innerHTML = "Image ajoutée avec succès";

         // apres Upload d une image le formulaire est vide
         categoriesError.innerHTML = "";
         formUpload.reset();
         sectionGallery.innerHTML = "";
         await displayProjects();

         // apres Upload d une image le previewContainer est vidé et remplacé par le logo
        displayPreviewContainer();

     // apres Upload d une image l'Image est dans la galerie de la modal1
          galleryModal.innerHTML = "";
          displayProjectsModal();
        }
       
      } catch (error) {
        console.log("Nope", error);
      } 
    }}

  //upload form
 const formUpload = document.querySelector(".form_upload");
 if (formUpload) {
  formUpload.addEventListener("submit", uploadProject);///// Le displayProjects doit se faire sur l'ID du projet
 sectionGallery.innerHTML = "";


// displayProjects();
} else {
  console.error("Nope");
}}
);

///tant que le formulaire n'est pas rempli, le bouton de validation est desactive///

const validateBtn = document.getElementById('validateBtn');
const formUpload = document.querySelector('.form_upload'); 
const projectName = document.getElementById("projectName")
const projectCategory = document.getElementById("projectCategories")

// Fonction pour vérifier si tous les champs sont remplis
function checkInputs() {

  // Si tous les champs sont ok validateBtn est activé
  if (projectName.value && projectCategory.value) {           
    validateBtn.classList.remove('button__off');
    validateBtn.classList.add('validateBtn');  

  } else {
    // Sinon,valideBtn est désactivé
    validateBtn.classList.remove('validateBtn');
    validateBtn.classList.add('button__off');
  }
}
projectName.addEventListener('input', checkInputs);
projectCategory.addEventListener('input', checkInputs);


