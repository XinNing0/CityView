//Get all the relative elements to use for rendering
//fetch picture for backend
//render them
let objs ={
    body: null,
    inputCity: null,
    btnSearch: null,
    carousel: null,
    preUrl: null,
    btnPrev: null,
    btnNext:null,
    page: {
        cursor: 1,
        total: 1
    }
}
const unplashKey = '6dpX61QS0GcTxNFVbujsGjGwW-AbhRASgIW9yiRH3wk'
const strClassSelected = 'selected'

objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel = document.querySelector('.gallery')
objs.btnPrev = document.querySelector('.btnNav.prev')
objs.btnNext = document.querySelector('.btnNav.next')


const cbInput = function (evt){
    if(evt.key === 'Enter' && objs.inputCity.value.trim().length){
        fetchData()
    }
}
const setKeyEvent = function (){


    objs.body.addEventListener('keyup', function (evt){
        if(evt.key === 'ArrowLeft'){
            prePage()
        }

        if (evt.key === 'ArrowRight'){
            nextPage()
        }
    })

//optimize the event listener,
    let arrEle = [objs.inputCity, objs.btnPrev, objs.btnNext]
    let evtName = ['keyup', 'click', 'click']
    let arrCB = [cbInput, prePage, nextPage]

    arrEle.forEach(function (ele, index){
        ele.addEventListener(evtName[index], arrCB[index])
    })

}

const prePage = function (){
    if (objs.page.cursor > 1){
        objs.page.cursor--
    }

    fetchData()
}

const nextPage = function (){
    if (objs.page.cursor < objs.page.total){
        objs.page.cursor--
    }

    fetchData()
}

const fetchData = function(){
    const newCity = objs.inputCity.value.trim().toLowerCase() || 'macbook' // trim: remove the un see, tab, sth else in value, if no value, use MacBook
    fetch(`https://api.unsplash.com/search/photos?client_id=${unplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data){
            //console.log('data fetched: ', data)//data in data.txt
            //console.log('data raw', data)
            renderImages(data.results)
            objs.page.total = data.total_pages
        })
}

const renderImages = function (arrImages){
    //set background images with new data got
    const img = arrImages[0].urls.full
    objs.body.style.background = `url('${img}') no-repeat center center fixed`
    //create carousel
    createCarousel(arrImages)
    
}

const updateBackgroundImage = function(url){
    objs.body.style.background = `url('${url}') no-repeat center center fixed`
}

const setImageSelected = function (eleImage) {
    eleImage.className = strClassSelected
    let images = document.querySelectorAll('[data-index]')
    images.forEach(function (ele){
        ele.className = ''
    })

    eleImage.className = strClassSelected

}


const createCarousel = function(arrImages){
    //
    objs.carousel.innerHTML = '' // delete the previous pictures everytime input and search

    for (let i = 0; i < arrImages.length; i++){
        let item = document.createElement('div')
        if (i === 0){
            //item.className = strClassSelected set the first one high light bug
        }
        item.className = 'imgContainer'
        item.style.background = 'imgContainer'

        const img = arrImages[i].urls.regular
        item.style.background = `url('${img}') no-repeat center center fixed`
        item.dataset.index = i
        item.dataset.url = arrImages[i].urls.full
        objs.carousel.appendChild(item)

        item.addEventListener('click', function (evt){
            updateBackgroundImage(evt.target.dataset.url)
            setImageSelected(evt.target)
            //console.log('evt click', evt)
        })

        item.addEventListener('mouseenter', function(evt){
            let newUrl = evt.target.dataset.url
            //replace the background temporarily
            if(!objs.preUrl){

                //save the current img url before replace
                let str = objs.body.style.background

                let iStart = str.indexOf('"')
                let iEnd = str.indexOf('"', iStart + 1)
                str = str.slice(iStart + 1, iEnd)
                objs.preUrl = str
            }
            updateBackgroundImage(newUrl)
        })

        item.addEventListener('mouseleave', function(evt){
            if(objs.preUrl){
                updateBackgroundImage(objs.preUrl)
                objs.preUrl = null
            }

        })

    }
}


fetchData()
setKeyEvent()
objs.btnSearch.addEventListener('click', fetchData)