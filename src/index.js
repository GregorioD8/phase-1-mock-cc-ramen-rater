

let addRamen = false
let editRamen = false
/////////////
let firstId = false
let lastId = 0
featuredRamenId = 0
let imageCollectionDiv = document.querySelector('#ramen-menu')
let ramenDetailDiv = document.querySelector('#ramen-detail')
let ratingDisplay = document.querySelector('#rating-display')
let commentDisplay = document.querySelector('#comment-display')
let newRamenForm = document.querySelector('#new-ramen') 
let editRamenForm = document.querySelector('#edit-ramen') 
let deleteRamenDiv = document.querySelector('#delete') 
newRamenForm.addEventListener('submit', handleSubmit) 
editRamenForm.addEventListener('submit', handleEdit)
//buttons for the featured ramen
let editBtn = editRamenForm.querySelector('h4')
let addBtn = newRamenForm.querySelector('h4')
let deleteBtn = deleteRamenDiv.querySelector('h4')
editBtn.addEventListener("click", handleHidden)
addBtn.addEventListener("click", handleHidden)
deleteBtn.addEventListener('mouseover', handleMouseEvent)
deleteBtn.addEventListener('mouseout', handleMouseEvent)
editBtn.addEventListener('mouseover', handleMouseEvent)
editBtn.addEventListener('mouseout', handleMouseEvent)
addBtn.addEventListener('mouseover', handleMouseEvent)
addBtn.addEventListener('mouseout', handleMouseEvent)

//show hide the forms
function handleHidden(e){
  e.preventDefault()
    
    if (e.target === editBtn){
        editRamen = !editRamen
        showHideForms(editBtn, editRamenForm, editRamen)
    } else if(e.target === addBtn){
        addRamen = !addRamen
        showHideForms(addBtn, newRamenForm, addRamen)
    } 

}


function showHideForms(btn, form, isShowing) {

    for(const child of form.children) {
        if (isShowing && child != btn) {
        child.style.display = "none"
        } else{
        child.style.display = "block"
        }
    }
}

function getAllRamen(){
    firstId = true
    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(ramenData => {

    for(let oneRamen of ramenData){        
        renderOneRamen(oneRamen)      
        if (firstId){           
            renderOneRating(oneRamen)
            firstId = false
        }       
    }
    })
}

function getRamenById(id){

    fetch(`http://localhost:3000/ramens/${id}`)
    .then(res => res.json())
    .then(ramenData => renderOneRating(ramenData))

} 


function renderOneRamen(oneRamen){
   
    let image = document.createElement('img')
    
   
    image.setAttribute('id', `${oneRamen.id}`)
    image.src = oneRamen.image
    imageCollectionDiv.appendChild(image)
    imageCollectionDiv.addEventListener('click', handleRating)
   
    lastId = oneRamen.id 
    
    //deletes ramen and images and sends next ramen to be featured rating
    deleteBtn.addEventListener('click', (e)=> {
    e.preventDefault()
    let img2 = document.querySelector('.detail-image')
    if(image.src === img2.src){
    image.remove()
    deleteRamen(oneRamen.id)
    let nextImg =imageCollectionDiv.querySelector('img')
    getRamenById(nextImg.id)

    }
})
}

//rating click event
function handleRating(e){
    e.preventDefault()
    console.log(e.target.id)
    getRamenById(e.target.id)
}

//render one rating to the DOM
function renderOneRating(oneRamen){

    let imageDisplay = ramenDetailDiv.querySelector('.detail-image')
    let nameDisplay = ramenDetailDiv.querySelector('.name')
    let restaurantDisplay = ramenDetailDiv.querySelector('.restaurant')

    imageDisplay.src = oneRamen.image
    nameDisplay.innerText = oneRamen.name
    restaurantDisplay.innerText = oneRamen.restaurant
    //global variables
    ratingDisplay.innerText = oneRamen.rating
    commentDisplay.innerText = oneRamen.comment
    //load update form
    editRamenForm.querySelector('#new-rating').value = oneRamen.rating
    editRamenForm.querySelector('#new-comment').value = oneRamen.comment

    featuredRamenId = oneRamen.id




}

function handleSubmit(e){
    e.preventDefault()
    console.log('click')
    newName = newRamenForm.querySelector('#new-name').value
    newRestaurant = newRamenForm.querySelector('#new-restaurant').value
    newImage = newRamenForm.querySelector('#new-image').value
    newRating = newRamenForm.querySelector('#new-rating').value
    newComment = newRamenForm.querySelector('#new-comment').value
    let newId = lastId + 1

    let newRamen = {
        id: newId,
        name: newName,
        restaurant: newRestaurant,
        image: newImage,
        rating: newRating,
        comment: newComment

    }
    //submits to API 
    addNewRamen(newRamen)
    //then renders to DOM whether the submit worked or not
    //render new ramen to #ramen-menu before adding to API
    //does not need to persist after refresh
    renderOneRamen(newRamen)
    newRamenForm.reset()
}

function handleEdit(e){
    e.preventDefault()

    editedRating = editRamenForm.querySelector('#new-rating').value
    editedComment = editRamenForm.querySelector('#new-comment').value

    let editedRamen = {
        id: featuredRamenId,
        rating: editedRating,
        comment: editedComment

    }
    //submits to API 
    updateRating(editedRamen)
    //then renders to DOM whether the submit worked or not
    //render new ramen to #ramen-menu before adding to API
    // //does not need to persist after refresh
    ratingDisplay.innerText = editedRating
    commentDisplay.innerText = editedComment
    editRamenForm.reset()
}

//adds new ramen to API
function addNewRamen(ramenObj){
    fetch(`http://localhost:3000/ramens`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
       body:JSON.stringify(ramenObj)

    })
    .then(res => res.json())
    .then(ramen => console.log(ramen))
}

//update Rating
function updateRating(ramenObj){
    fetch(`http://localhost:3000/ramens/${ramenObj.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(ramenObj)
        })
        .then(res => res.json())
        .then(ramen => console.log(ramen))
}


function  deleteRamen(id){
    
    fetch(`http://localhost:3000/ramens/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(res => res.json())
    .then(ramen => console.log(ramen))
   
}


function handleMouseEvent(e){

    if(e.type === 'mouseover'){
        e.target.style.color = 'red'
    }else if(e.type === 'mouseout'){
        e.target.style.color = 'white'
        
    }

}


function initialize(){

    getAllRamen()
    showHideForms(editBtn, editRamenForm, true)
    showHideForms(addBtn, newRamenForm, true)
}

initialize()





