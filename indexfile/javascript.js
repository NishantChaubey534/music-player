console.log("lets start");
let currentsong = new Audio();
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            const filename = element.href.substring(element.href.lastIndexOf("/") + 1);
            songs.push(filename)
            // songs.push(element.href.substring(url.lastIndexOf("/") + 1));
        }

    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async  function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs`)
    // let response = await a.text()
    // // console.log(response)
    // let div = document.createElement("div")
    // div.innerHTML = response
    // let anchors=div.getElementsByTagName("a")
    // Array.from(anchors).forEach(e=>{
    //     if(e.href.includes("/album")){
    //         console.log(e.href.split("/").slice(-1)[0])
    //     }
    // })
    
// }


// async function displayAlbums() {
    console.log("displaying albums")
    // let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/album") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            console.log(folder)
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            console.log(`${item.currentTarget.dataset.folder}`)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0])
           

        })
    })
}


 
async function main() {

    await getsongs("songs/album1")
    playmusic(songs[0], true)
    // console.log(songs)
    // let songul=document.querySelector(".songList").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songul.innerHTML=songul.innerHTML + `<li> ${song} </li>`;
    // }
    // Show all the songs in the playlist
    await displayAlbums()
  
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg"
        } else {
            currentsong.pause();
            play.src = "img/play.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}
        /${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100
            + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })
    previous.addEventListener("click", () => {
        currentsong.pause();
        console.log("previous clicked");
        console.log(currentsong);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // console.log(index);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        } else {
            play.src = "img/play.svg"
        }
    })
    next.addEventListener("click", () => {
        currentsong.pause();
        console.log("next clicked");
        console.log(currentsong);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // console.log(index);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);

        } else {
            play.src = "img/play.svg"
        }
    })
    document.querySelector(".range").addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })
    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     e.addEventListener("click", async item => {
    //         songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)


    //     })
    


    
   

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })





}
main()
