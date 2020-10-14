(function () {
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const data = []
    const displayPanel = document.getElementById('display-panel')
    const personInfo = document.getElementById('show-person-info')
    const pagination = document.getElementById('page-navigation')
    const genderFilter = document.getElementById('gender-filter')
    const ageFilter = document.getElementById('age-filter')
    const minInput = document.getElementById('min-input')
    const maxInput = document.getElementById('max-input')
    const resetBnt = document.getElementById('reset')
    const modeSelector = document.getElementById('mode-selector')
    const ITEM_PER_PAGE = 15
    let favoriteList = JSON.parse(localStorage.getItem('favoritePeople')) || []
    let currentPage = 1
    let currentData = []
    let currentMode = 'card'
    let maxPage = 1
    let minAge = 100
    let maxAge = 0


    axios.get(INDEX_URL)
        .then((response) => {
            data.push(...response.data.results)
            console.log(data)
            currentData = data
            ageFiltered = data
            genderFiltered = data

            getMinMaxAge(data)
            totalPage(data)
            getPage(1, data, currentMode)
        })
        .catch((error) => console.log(error))

    function reset() {
        currentData = data
        currentPage = 1
        currentMode = 'card'
        totalPage(data)
        getPage(1, data, 'card')
    }
    function getMinMaxAge(data) {
        for (let person of data) {
            if (person.age > maxAge) maxAge = person.age
            if (person.age < minAge) minAge = person.age
        }
    }
    // mode

    modeSelector.addEventListener('click', (event) => {
        if (event.target.matches('#card-mode')) {
            currentMode = 'card'
        }

        else if (event.target.matches('#list-mode')) {
            currentMode = 'list'
            console.log(currentMode)
        }
        getPage(currentPage, currentData, currentMode)
    })

    // filter

    function filter_age(min, max) {
        currentData = currentData.filter(person => person.age >= min)
        currentData = currentData.filter(person => person.age <= max)
    }
    ageFilter.addEventListener('click', (event) => {
        event.preventDefault()
        let min = minInput.value
        let max = maxInput.value
        if (event.target.matches('.btn')) {
            filter_age(min, max)
            totalPage(currentData)
            getPage(1, currentData, currentMode)
            console.log(currentData)
        }
    })
    genderFilter.addEventListener('click', (event) => {
        if (event.target.matches('#male')) {
            currentData = data.filter(data => data.gender === 'male')
        }
        else if (event.target.matches('#female')) {
            currentData = data.filter(data => data.gender === 'female')
        }
        else {
            currentData = data
        }
        if (minInput.value !== '' && maxInput.value !== '')
            filter_age(minInput.value, maxInput.value)

        console.log(currentData)
        totalPage(currentData)
        getPage(1, currentData, currentMode)
    })



    //display

    function displayCard(data) {
        let htmlContent = ''
        for (let person of data) {
            htmlContent += `
            <div class="d-flex flex-column m-1" id="displayCard">
                <img src="${person.avatar}" id="${person.id}"  style="width:150px;" data-toggle="modal" data-target="#show-info-modal">`
            if (person.gender === "male") {
                htmlContent += `<h5 class="">${person.name} ${person.surname} <i class="fas fa-mars" style="color:#85CAE9" ></i><span style="color:#F8F9FA;"> , ${person.age}</span></h5>`
            }
            else {
                htmlContent += `<h5 class="">${person.name} ${person.surname} <i class="fas fa-venus" style="color:#FE8585" ></i><span style="color:#F8F9FA;"> , ${person.age}</span></h5>`
            }
            htmlContent += `</div>`
        }
        displayPanel.innerHTML = htmlContent
    }

    function displayList(data) {
        let htmlContent = `<div id="displayList" class="col-12" style="padding:auto;">`
        for (let person of data) {
            htmlContent += `
            <div class="row no-gutters ">
                <div class="col-1 offset-4">
                    <img src="${person.avatar}" id="${person.id}" class="" width="150px"  data-toggle="modal" data-target="#show-info-modal">
                </div>
                <div class="col-6 offset-1">
                    <div class="card-body " style="text-align:left;">
                    `
            if (person.gender === 'male') {
                htmlContent += `<h5 class="mr-5" >${person.name} ${person.surname} , ${person.age} <i class="fas fa-mars ml-3" style="color:#85CAE9" ></i></h5>`
            }
            else {
                htmlContent += `<h5 class="mr-5" >${person.name} ${person.surname} , ${person.age} <i class="fas fa-venus ml-3" style="color:#FE8585" ></i></h5>`
            }
            htmlContent +=
                `
                        <h6 class="my-3"><i class="fas fa-map-marker-alt"></i> ${person.region}</h6>
                        <h6 class=""> <i class="fas fa-envelope-open-text"> </i> Email : ${person.email} </h6>
                    </div>
                </div>
            </div>
            <div><hr><div>
            
            `
        }
        htmlContent += `</div>`
        displayPanel.innerHTML = htmlContent
    }


    // modal

    displayPanel.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            const id = event.target.id
            showDetailData(id)
        }
    })


    function showDetailData(id) {
        axios.get(INDEX_URL + id)
            .then((response) => {
                let person = response.data
                let htmlContent = `
                <div class="modal-body" id="person-info">
                    <img src="${person.avatar}" class="col-12" id="person-image" >
                    <h4 class="col-12">${person.name} ${person.surname}, ${person.age}</h4>
                    <h6 class ="col-12" id="person-description"><i class="fas fa-map-marker-alt"></i> ${person.region} </h6>
                    <div class="col-12"><hr></div>
                    <h6 class="col-12"><i class="fas fa-birthday-cake"> </i> Birthday : ${person.birthday}</h6>
                    <h6 class="col-12"><i class="fas fa-envelope-open-text"> </i> Email : ${person.email} </h6>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" id="add-favorite" data-id="${person.id}" data-dismiss="modal"><i class="far fa-heart"></i> Like</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div> 
                `
                personInfo.innerHTML = htmlContent
            })

    }

    // favorite
    personInfo.addEventListener('click', (event) => {
        if (event.target.matches('#add-favorite')) {
            let id = event.target.dataset.id
            addFavorite(id)
            getPage(currentPage, currentData, currentMode)
        }
    })

    function addFavorite(id) {
        const favoritePerson = data.find(person => person.id === Number(id))

        if (favoriteList.some(item => item.id === Number(id)))
            alert(`Already in the favorite list.`)
        else {
            favoriteList.push(favoritePerson)
        }
        localStorage.setItem('favoritePeople', JSON.stringify(favoriteList))
        console.log(favoriteList)
    }

    function markFavorite(data) {
        for (let person of favoriteList) {
            data.forEach(index => {
                if (index.id === person.id) {
                    let avatar = document.getElementById(`${person.id}`)
                    avatar.setAttribute('class', 'favorite-img')
                }
            })
        }
    }

    // page

    function totalPage(data) {
        maxPage = Math.ceil(data.length / ITEM_PER_PAGE) || 1
        let htmlContent = `
        <li class="page-item">
            <a href="javascript:;" class="page-link" aria-label="Previous" id="previous">
                <span aria-hidden="true" id="previous">&laquo;</span>
            </a>
        </li>`
        for (let i = 1; i <= maxPage; i++) {
            htmlContent += `
            <li class="page-item " id="page-${i}">
                <a class="page-link " href="javascript:;" data-page="${i}" >${i}</a>
            </li>
            `
        }
        htmlContent += `
        <li class="page-item">
            <a class="page-link" href="javascript:;" aria-label="Next" id="next">
                <span aria-hidden="true" id="next">&raquo;</span>
            </a>
        </li>`
        pagination.innerHTML = htmlContent

    }

    function getPage(pageNum, data, currentMode) {  //data有時候要拿來傳入filtered data
        let index = (pageNum - 1) * ITEM_PER_PAGE
        let sliceData = data.slice(index, index + ITEM_PER_PAGE)
        if (currentMode === 'card')
            displayCard(sliceData)
        else if (currentMode === 'list') {
            displayList(sliceData)
        }
        markFavorite(sliceData)
    }

    pagination.addEventListener('click', function (event) {
        console.log(event.target)
        if (event.target.matches('#previous')) currentPage === 1 ? currentPage = 1 : currentPage--
        else if (event.target.matches('#next')) currentPage !== maxPage ? currentPage++ : currentPage = maxPage
        else {
            currentPage = event.target.dataset.page
        }
        getPage(currentPage, currentData, currentMode)
    })


    //reset

    resetBnt.addEventListener('click', () => {
        reset()
    })

})()