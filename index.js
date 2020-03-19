(function(){
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const data = []
    const displayPanel = document.getElementById('display-panel')
    const personInfo = document.getElementById('show-person-info')
    const pagination = document.getElementById('page-navigation')
    const genderFilter =document.getElementById('gender-filter')
    const ageFilter = document.getElementById('age-filter')
    const minInput = document.getElementById('min-input')
    const maxInput =document.getElementById('max-input')
    const resetBnt = document.getElementById('reset')
    const ITEM_PER_PAGE = 15
    let currentPage = 1
    let maxPage = 1
    let currentData =[]
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
            getPage(1,data)
        })
        .catch((error) => console.log(error))

    function reset(){
        currentData = data
        totalPage(data)
        getPage(1,data)
    }
    function getMinMaxAge(data){
        for (let person of data){
            if(person.age > maxAge) maxAge = person.age
            if(person.age < minAge) minAge = person.age
        }
    }

    // filter

    function filter_age(min,max){
        currentData = currentData.filter(person => person.age >= min)
        currentData = currentData.filter(person => person.age <= max)
    }
    ageFilter.addEventListener('click', (event) => {
        event.preventDefault()
        let min = minInput.value
        let max = maxInput.value
        if(event.target.matches('.btn')){
            filter_age(min,max)
            totalPage(currentData)
            getPage(1,currentData)
            console.log(currentData)
        }
    })
    genderFilter.addEventListener('click', (event)=> {
        if(event.target.matches('#male')){
            currentData = data.filter(data => data.gender === 'male')
        }
        else if(event.target.matches('#female')){
            currentData = data.filter(data => data.gender === 'female')
        }
        else {
            currentData = data
        }
        if(minInput.value !== '' && maxInput.value !== '')  
            filter_age(minInput.value,maxInput.value)

        console.log(currentData)
        totalPage(currentData)
        getPage(1,currentData)
    })


    
    //display

    function displayInfo(data){
        let htmlContent = ''
        for(let person of data){
            htmlContent += `
            <div class="d-flex flex-column m-1" id="display-person">
                <img src="${person.avatar}" id="${person.id}" class="img-thumbnail" data-toggle="modal" data-target="#show-info-modal">`
            if(person.gender ==="male") {
                htmlContent += `<h5 class="">${person.name} ${person.surname} <i class="fas fa-mars" style="color:#85CAE9" ></i></h5>`
            }
            else{
                htmlContent += `<h5 class="">${person.name} ${person.surname} <i class="fas fa-venus" style="color:#FE8585" ></i></h5>`
            }
            htmlContent +=`</div>`
        }
        displayPanel.innerHTML = htmlContent
    }

    // modal

    displayPanel.addEventListener('click',function(event){
        if(event.target.tagName==='IMG'){
        const id = event.target.id
        showDetailData(id)
        }
    })
    
    function showDetailData(id){
        axios.get(INDEX_URL+id)
            .then((response) => {
                let person = response.data
                let htmlContent = `
                <div class="modal-body" id="person-info" >
                    <img src="${person.avatar}" class="col-12" id="person-image" >
                    <h4 class="col-12">${person.name} ${person.surname}, ${person.age}</h4>
                    <h6 class ="col-12" id="person-description"><i class="fas fa-map-marker-alt"></i> ${person.region} </h6>
                    <div class="col-12"><hr></div>
                    <h6 class="col-12">Birthday : ${person.birthday}</h6>
                    <h6 class="col-12">Email : ${person.email} </h6>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                         
                `
                personInfo.innerHTML = htmlContent
            })
    
    }

    // page

    function totalPage(data){
        maxPage =  Math.ceil(data.length/ITEM_PER_PAGE) || 1
        let htmlContent = `
        <li class="page-item">
            <a href="javascript:;" class="page-link" aria-label="Previous" id="previous">
                <span aria-hidden="true" id="previous">&laquo;</span>
            </a>
        </li>`
        for(let i=1;i<=maxPage;i++){
            htmlContent +=`
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
    
    function getPage(pageNum, data){  //data有時候要拿來傳入filtered data
        let index = (pageNum - 1) * ITEM_PER_PAGE
        let sliceData = data.slice(index , index + ITEM_PER_PAGE)
        displayInfo(sliceData)
    }

    pagination.addEventListener('click', function(event){
        console.log(event.target)
        if(event.target.matches('#previous')) currentPage === 1 ? currentPage = 1 : currentPage --
        else if(event.target.matches('#next')) currentPage !== maxPage ? currentPage ++ : currentPage = maxPage
        else{
            currentPage = event.target.dataset.page
        }
        getPage(currentPage,currentData)
    })


    //reset

    resetBnt.addEventListener('click', () =>{
        reset()
    })

    

    
    
    
    

})()