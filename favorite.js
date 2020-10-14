(function () {
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const displayPanel = document.getElementById('display-panel')
    const personInfo = document.getElementById('show-person-info')
    const pagination = document.getElementById('page-navigation')
    const genderFilter = document.getElementById('gender-filter')
    const modeSelector = document.getElementById('mode-selector')
    const ITEM_PER_PAGE = 15
    let currentPage = 1
    let currentMode = 'card'
    let maxPage = 1
    const data = JSON.parse(localStorage.getItem('favoritePeople'))
    let currentData = data

    console.log(data)
    totalPage(data)
    getPage(1, data, currentMode)


    //filter

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
        // if(minInput.value !== '' && maxInput.value !== '')  
        //     filter_age(minInput.value,maxInput.value)

        console.log(currentData)
        totalPage(currentData)
        getPage(1, currentData, currentMode)
    })

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
            // <h5 class="">${person.name} ${person.surname}, ${person.age}</h5>
            // <h6 class=""><i class="global-icon"></i> ${person.region}</h6>
            // <h6 class=""> <i class="fas fa-birthday-cake"> </i> Birthday : ${person.birthday} </h6>
            // <h6 class=""> <i class="fas fa-envelope-open-text"> </i> Email : ${person.email} </h6>
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
                    <button type="button" class="btn btn-outline-success" id="add-favorite" data-id="${person.id}" data-dismiss="modal"><i class="fas fa-heart-broken"></i> Unlike</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div> 
                `
                personInfo.innerHTML = htmlContent
            })

    }

    //  favorite-delete

    personInfo.addEventListener('click', (event) => {
        if (event.target.matches('#add-favorite')) {
            deleteFavorite(event.target.dataset.id)
        }
    })

    function deleteFavorite(id) {
        const deleteIndex = data.findIndex(person => person.id === Number(id))

        data.splice(deleteIndex, 1)
        localStorage.setItem('favoritePeople', JSON.stringify(data))
        console.log(data)
        currentData = data
        totalPage(currentData)
        getPage(currentPage, currentData, currentMode)
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

})()