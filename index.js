(function(){
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const data = []
    const displayPanel = document.getElementById('display-panel')
    const personInfo = document.getElementById('show-person-info')

    axios.get(INDEX_URL)
        .then((response) => {
            data.push(...response.data.results)
            console.log(data)
            displayInfo(data)
        })
        .catch((error) => console.log(error))
    
    
    displayPanel.addEventListener('click',function(event){
        if(event.target.tagName==='IMG'){
        const id = event.target.id
        showPerson(id)
        }
    })

    function displayInfo(data){
        let htmlContent = ''
        for(let person of data){
            htmlContent += `
            <div class="d-flex flex-column m-1" id="display-person">
                <img src="${person.avatar}" id="${person.id}" class="img-thumbnail" data-toggle="modal" data-target="#show-info-modal">
                <h5>${person.name} ${person.surname}</h5>
            </div>
            `
        }
        displayPanel.innerHTML += htmlContent
    }

    function showPerson(id){
        axios.get(INDEX_URL+id)
            .then((response) => {
                let person = response.data
                let htmlContent = `
                <div class="modal-header">
                    <h2 class="modal-title" id="person-title">${person.name} ${person.surname}</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <div class="modal-body row" id="person-name" >
                    <img src="${person.avatar}" class = "col-12" id="person-image">
                    <h4 class="col-12">${person.name} ${person.surname}, ${person.age}</h4>
                    <h6 class ="col-12" id="person-description"><i class="global-icon"></i> ${person.region} </h6>
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

})()