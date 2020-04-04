
//Spare Key
//const API_KEY = "AIzaSyAvqpZmLm_sWutcsSyQBF0NkK_oLKmStRw";
const API_KEY = "AIzaSyA_8hDUK6d5Vz63PpLFOH1bHJIzPpdRAys";
let nextToken = "";
let prevToken = "";
let searchTerm = "";
let page = "0";
let url;



function fetchVideos(){
    console.log("next: " + nextToken)
    console.log("prev: " + prevToken)
    console.log("page: " + page)

    if (page == "0"){
        url = `https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&key=${API_KEY}&part=snippet&maxResults=10`
    }
    else if (page == "1"){
        url = `https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&key=${API_KEY}&part=snippet&maxResults=10${nextToken}`
    }
    else if (page == "-1"){
        url = `https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&key=${API_KEY}&part=snippet&maxResults=10${prevToken}`
    }

    let settings = {
        method : 'GET'
    };
    console.log( url );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {

            if (responseJSON.prevPageToken != null){
                prevToken = `&pageToken=${responseJSON.prevPageToken}`
            }
            else{
                prevToken = ""
            }

            if (responseJSON.nextPageToken != null){
                nextToken = `&pageToken=${responseJSON.nextPageToken}`
            }
            else{
                nextToken = ""
            }


            displayResults( searchTerm, responseJSON );
        })
        .catch( err => {
            console.log( err );
        });
}

function displayResults( searchTerm, data ){
    let results = document.querySelector( '.results' );

    results.innerHTML = "";

    for( let i = 0; i < data.items.length; i ++ ){
        results.innerHTML += `
            <div class = "video">
                <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="blank">
                    <h2>
                        ${data.items[i].snippet.title}
                    </h2>
                    <div>
                        <img src="${data.items[i].snippet.thumbnails.high.url}" alt = "${data.items[i].snippet.title}"/>
                    </div>
                </a>
            </div>
        `;
    }
}

function watchButtons(searchTerm, data){
    
    let nextBtn = document.querySelector(".nextPageBtn");
    let prevBtn = document.querySelector(".prevPageBtn");

    nextBtn.addEventListener( 'click', ( event) => {
        page = "1";
        fetchVideos()
    })

    prevBtn.addEventListener( 'click', ( event) => {
        page = "-1";
        fetchVideos()
    })


}

function watchForm(){
    let submitButtton = document.querySelector( '.submitButtton' );
    
    let nextBtn = document.querySelector(".nextPageBtn");
    let prevBtn = document.querySelector(".prevPageBtn");

    submitButtton.addEventListener( 'click', ( event ) => {
        
        if (document.querySelector( '#searchTerm' ).value != "")
        {

            nextBtn.classList.remove("hidden");
            prevBtn.classList.remove("hidden");

            event.preventDefault();
            searchTerm = document.querySelector( '#searchTerm' ).value;
            fetchVideos();
        }

    });
}

function init(){
    watchForm();
    watchButtons();
}

init();