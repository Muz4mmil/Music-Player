const loader = document.querySelector(".loader");
const animtimeout = setTimeout( function(){
    loader.style.animation = "hide .5s forwards";
}, 2000)
const loadtimeout = setTimeout( function(){
    loader.style.display = "none";
}, 3000)


const wrapper = document.querySelector(".wrapper"),
mainAudio = document.querySelector("#main-audio"),
playPauseBtn = document.querySelector(".play-pause"),
progressArea = document.querySelector(".progress-area"),
progressBar = document.querySelector(".progress-bar"),
musicList = document.querySelector(".music-list")
showMore = document.querySelector("#more-music"),
hideMusic = document.querySelector("#close"),
showMenu = wrapper.querySelector("#openMenu"),
hideMenu = document.querySelector("#closeMenu"),
darkbtn = document.querySelector(".dark");


showMore.addEventListener('click', ()=>{
    musicList.classList.toggle('show');
});

hideMusic.addEventListener('click', ()=>{
    showMore.click();
});

function openMenu(){
    document.querySelector(".menu").classList.toggle('show');
};


darkbtn.addEventListener('click', ()=>{
    document.body.classList.toggle('darkMode');
    
    if (darkbtn.innerText == "Dark Mode"){
        darkbtn.innerText = "Light Mode";
    } else {
        darkbtn.innerText = "Dark Mode";
    }
    openMenu();
});

let musicIndex = 1;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb){
    document.querySelector(".song-details .name").innerText = allMusic[indexNumb - 1].name;
    document.querySelector(".song-details .artist").innerText = allMusic[indexNumb - 1].artist;
    document.querySelector(".img-area img").src = `album-art/${allMusic[indexNumb - 1].img}.jpg` ;
    document.querySelector(".bgblur img").src = `album-art/${allMusic[indexNumb - 1].img}.jpg` ;
    document.querySelector("#main-audio").src = `mp3/${allMusic[indexNumb - 1].src}.mp3` ;
}

function playMusic(){
    document.querySelector(".wrapper").classList.add("paused");
    document.querySelector("#main-audio").play();
    document.querySelector(".play-pause").querySelector("i").innerText = "pause";
}
function pauseMusic(){
    document.querySelector(".wrapper").classList.remove("paused");
    document.querySelector("#main-audio").pause();
    document.querySelector(".play-pause").querySelector("i").innerText = "play_arrow";
}

function nextSong(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex=1 : musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
function prevSong(){
    musicIndex--;
    musicIndex < 1 ? musicIndex=allMusic.length : musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPauseBtn.addEventListener('click', ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

mainAudio.addEventListener('timeupdate', (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration)* 100;
    progressBar.style.width = `${progressWidth}%`;
    
    let songCurrentTime = wrapper.querySelector(".current"),
    songDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{

        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalsec = Math.floor(audioDuration % 60);
        if(totalsec < 10){
            totalsec = `0${totalsec}`
        }
        songDuration.innerText = `${totalMin}:${totalsec}`;
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentsec = Math.floor(currentTime % 60);
    if(currentsec < 10){
        currentsec = `0${currentsec}`
    }
    songCurrentTime.innerText = `${currentMin}:${currentsec}`;
});

progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffsetX / progressWidthval)*songDuration;
})

const repeatbtn = wrapper.querySelector("#repeat-plist");
repeatbtn.addEventListener("click", ()=>{
    let getText = repeatbtn.innerText;

    switch(getText){
        case 'repeat':
            repeatbtn.innerText = "repeat_one";
            break;
        case 'repeat_one':
            repeatbtn.innerText = "shuffle";
            break;
        case 'shuffle':
            repeatbtn.innerText = "repeat";
            break;
    }
});

mainAudio.addEventListener("ended", ()=>{
    let getText = repeatbtn.innerText;

    switch(getText){
        case 'repeat':
            nextSong();
            break;
        case 'repeat_one':
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case 'shuffle':
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    };
});

const ulTag = document.querySelector("ul");

for (let i = 0; i < allMusic.length; i++){ 

    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <img src="album-art/${allMusic[i].img}.jpg">
                        <div class="li-detail">
                            <span>${allMusic[i].name}</span>
                            <p>${allMusic[i].artist}</p>
                        </div>
                    </div>
                    <audio class="${allMusic[i].src}" src="mp3/${allMusic[i].src}.mp3"></audio>
                    <span id="dura" class="material-icons"></span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
}

const allLiTags = ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector("#dura");

        if(allLiTags[j].classList.contains("equalizer")){
            allLiTags[j].classList.remove("equalizer");
            audioTag.innerText = "";
        }
    
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("equalizer");
            audioTag.innerText = "equalizer";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}