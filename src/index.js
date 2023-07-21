// write your code here
base_Url = 'http://localhost:3000'
ramensApi = '/ramens'
ramenIdApi = '/ramens/:id'

let lastId = 0
let imageCollectionDiv = document.getElementById('ramen-menu')
let ramenDetailDiv = document.querySelector('#ramen-detail')

let ratingDisplay = document.querySelector('#rating-display')
let commentDisplay = document.querySelector('#comment-display')
let newRamenForm = document.querySelector('#new-ramen') 

newRamenForm.addEventListener('submit', handleSubmit) 

function getAllRamen(){

    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(ramenData => ramenData.forEach(ramen => renderOneRamen(ramen)))
}

function getRamenById(id){

    fetch(`http://localhost:3000/ramens/${id}`)
    .then(res => res.json())
    .then(ramenData => renderOneRating(ramenData))

} 

function renderOneRamen(oneRamen){

    let image = document.createElement('img')
    image.src = oneRamen.image
    image.setAttribute('id', `${oneRamen.id}`)
    imageCollectionDiv.appendChild(image)
    imageCollectionDiv.addEventListener('click', handleRating)
    lastId = oneRamen.id 
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

}

function handleSubmit(e){
    e.preventDefault()

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
    addNewRamen(ramenObj)
    //render new ramen to #ramen-menu before adding to API
    //does not need to persist after refresh
    renderOneRamen(newRamen)
    newRamenForm.reset()

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



function initialize(){

    getAllRamen()

}

getAllRamen()
