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


const modalProjects  =  getGalleryProjects();//recupere les projets de la galerie depuis l'API


function main(){
 /* getGalleryProjects();
    displayProjectsModal();
    switchModal();
    uploadProject();
    deleteProject();
    deleteFigureFromAPI();
    switchModal2();
    getCategories();
  
 */

}

//******************* ouvrir et fermer la modale

openBtn.onclick = function() { 
modal.style.display = "block"; 
modal1.style.display = "flex";//au clic il n'y a toujours que la modal1 qui s'ouvre
modal2.style.display = "none";
}

closeBtn.onclick = function() {// au clic sur la croix, la modale se ferme
  modal.style.display = "none";
window.location.reload();

}


window.onclick = function(event) { // au clic en dehors de la modale, la modale se ferme
   if (event.target == modal) {//si l'evenement est la modale
   modal.style.display = "none";//ferme la modale
    window.location.reload();
   }
   
 
  }





//********************recuperer les projets de la galerie depuis l'API

async function getGalleryProjects() {
  const response = await fetch ("http://localhost:5678/api/works");
return await response.json();
}
getGalleryProjects();



//**********************afficher les projets dans la modale


async function displayProjectsModal(){

  const modalProjects = await getGalleryProjects();
  
  for (let i = 0; i < modalProjects.length; i++) {
  
    // figure/Projet
    const figure = modalProjects[i];
    const projectFigure = document.createElement("figure");
    projectFigure.dataset.id = "Figure"+ i;
    projectFigure.classList.add("projectFigureModal");
  
    //icone delete
    const containerDelete = document.createElement('div');
    containerDelete.classList.add("containerDelete");
    const deleteIcon = document.createElement('img');
    deleteIcon.src="./assets/icons/trash-can-solid.svg";
    deleteIcon.classList.add("deleteIcon");
    deleteIcon.id = `deleteIcon-${i}`; // Ajoute un ID unique à chaque icône de suppression
    /*si j upload plusieurs fois la meme image, en cliquant sur l'icone de suppression peu importe laquelle,
    c'est la derniere image qui est supprimee */

    
    // Supprimer un projet de la galerie depuis la modale en cliquant sur l'icône de suppression
    deleteIcon.addEventListener('click', async (event) => {
    // Supprime la figure de l'API
    await deleteFigureFromAPI(figure.id);
    // Supprime la figure du DOM
    projectFigure.remove();
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


//**************************Supprimer un projet de la galerie depuis l'API
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

    //revoir la condition 
    
  if (!response.ok) {
    throw new Error('Request failed');

   
  } else {
    console.log('Photo supprimée avec succès');
  
  }
}


//*********************Acceder à modal2 depuis modal1

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

//*********************fleche retour

const arrowBack = document.getElementById('arrowBack') //
    arrowBack.addEventListener ("click", switchModal2)
function switchModal2() {
    const modal1 = document.querySelector('.modal1')
    const modal2 = document.querySelector('.modal2')

    if (modal2.style.display === 'flex') {
        modal2.style.display = 'none'
        modal1.style.display = 'flex'
    } else {
        modal2.style.display = 'flex'
        modal1.style.display = 'none'
    }


}

//***********************recuperer les categories depuis l'API pour le menu deroulant
 
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



//************************************************************upload et preview */





document.addEventListener("DOMContentLoaded", function () {
 
  // Preview image

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
//upload project
  async function uploadProject(event) {
    event.preventDefault();

    const projectName = document.getElementById("projectName").value;
    const projectCategory = document.getElementById("projectCategories").value;
    const selectedFile = addProjectInput.files[0];

    // Check if all fields are filled
    if (selectedFile) {
      const token = window.localStorage.getItem("token").replace(/['"]+/g, '');
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", projectName);
      formData.append("category", projectCategory);
    
      if (!projectName) { // Check if project name is missing or empty
        alert("Veuillez ajouter un titre");
        nameError.innerHTML = "Veuillez ajouter un titre";
        return; // Exit the function if project name is missing or empty
      }

      if (!selectedFile) { // Check if image is missing
        alert("Veuillez ajouter un fichier");
        nameError.innerHTML = "Veuillez ajouter un fichier";
        return;}


 // fetch POST request
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
         // console.log("it works! youhouuuu");
         window.location.reload();
        } else {
         // console.error("Nope");
         nameError.innerHTML ="Echec de l'upload";
        }
      } catch (error) {
        nameError.innerHTML ="Veuillez remplir tous les champs";
        console.error("Nope", error);
      }
    }
  }
//upload form
  const formUpload = document.querySelector(".form_upload");
  if (formUpload) {
    formUpload.addEventListener("submit", uploadProject);
  } else {
    console.error("Nope");
  }
}
);

//tant que le formulaire n'est pas rempli, le bouton de validation est desactive


const validateBtn = document.getElementById('validateBtn');
const formUpload = document.querySelector('.form_upload'); 

formUpload.addEventListener('input', () => {
  if (formUpload.checkValidity()) {
    validateBtn.classList.remove('button__off');
    validateBtn.classList.add('input[type="submit"]','validateBtn');
    validateBtn.removeAttribute('disabled');
    console.log('ok');
  } else {
    validateBtn.classList.remove('input[type="submit"]', 'validateBtn');
    validateBtn.classList.add('button__off');
    validateBtn.setAttribute('disabled', 'disabled');
    console.log('nope');
  }

});


