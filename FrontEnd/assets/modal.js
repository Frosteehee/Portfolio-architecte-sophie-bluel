

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
    uploadProject();
    deleteProject();
  
 */

}



//************** */ ouvrir et fermer la modale
openBtn.onclick = function() { 
  modal.style.display = "block"; 
modal1.style.display = "flex";//au clic il n'y a toujours que la modal1 qui s'ouvre
modal2.style.display = "none";
}

closeBtn.onclick = function() {
  modal.style.display = "none";
}




//recuperer les projets de la galerie depuis l'API

async function getGalleryProjects() {
  const response = await fetch ("http://localhost:5678/api/works");
return await response.json();

}
getGalleryProjects();



//**********************afficher les projets dans la modale

async function displayProjectsModal(){

const modalProjects = await getGalleryProjects();//recupere les projets de la galerie depuis l'API via la fonction getGalleryProjects
for (let i = 0; i < modalProjects.length; i++) {//boucle for pour parcourir les donnees de l'api

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

    if (modal1.style.display === 'flex') {
        modal1.style.display = 'none'
        modal2.style.display = 'flex'
    } else {
        modal1.style.display = 'flex'
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

// Envoyer les données du formulaire à l'API
async function uploadProject(event) {
  event.preventDefault();
  const projectName = document.getElementById("projectName").value;
  const projectCategory = document.getElementById("projectCategories").value; 
  const fileInput = document.querySelector('input[type="file"]');
  const token = window.localStorage.getItem("token").replace(/['"]+/g, '');

  
  const formData = new FormData(); //multipart ne fonctionne pas ?
  formData.append("image", fileInput.files[0]);//recupere l'image
  formData.append("title", projectName);//recupere le titre
  formData.append("category", projectCategory);//recupere la categorie

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData   //multipart ne fonctionne pas 
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    
    //  getGalleryProjects();
     // displayProjects();
      console.log("it works !");
    } else {
      console.error("Nope");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const formUpload = document.querySelector(".form_upload");
formUpload.addEventListener("submit", uploadProject);

//comment adapter la taille des images/ ajouter une classe ?


/////Delete project
//function deleteProject(event) {
const deleteIcon = document.querySelector(".deleteIcon");

deleteIcon.addEventListener("click", async (e) => { //addEventlistener sur l'icone delete ne fonctionne pas ? /null
  e.preventDefault();
  e.stopPropagation();
  const deleteIcon = article.id;

  console.log(deleteIcon);
  const response = await fetch(
    `http://localhost:5678/api/works/${id}`,
    {
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
    projectFigure.remove();
  }
}
  )
  console.log("deleteIcon");

//}



  


