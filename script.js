/* ======================================================
   R0T0'S DOS GAME LIBRARY v1.37
====================================================== */


/* ======================================================
   ELEMENTS
====================================================== */


const bootScreen = document.getElementById("bootScreen");
const bootText = document.getElementById("bootText");

const loginScreen = document.getElementById("loginScreen");
const loginPrompt = document.getElementById("loginPrompt");

const library = document.getElementById("library");

const terminalText = document.getElementById("terminalText");

const launchButton = document.getElementById("launchButton");
const closeGame = document.getElementById("closeGame");

const dosContainer = document.getElementById("dosContainer");

const rightPanel = document.getElementById("rightPanel");

const installedCount = document.getElementById("installedCount");


const gameTitle = document.getElementById("gameTitle");
const developer = document.getElementById("developer");
const release = document.getElementById("release");
const engine = document.getElementById("engine");
const status = document.getElementById("status");
const executable = document.getElementById("executable");
const description = document.getElementById("description");



/* AUDIO */

const keyboard = document.getElementById("keyboard");
const startup = document.getElementById("startup");






/* ======================================================
   AUDIO CONTROL
====================================================== */


let audioUnlocked = false;

let bootStarted = false;



function playSound(sound){

    if(!sound)
        return;


    sound.pause();

    sound.currentTime = 0;

    sound.volume = 0.35;


    sound.play().catch(()=>{});

}




function unlockAudio(){


    if(audioUnlocked)
        return;



    keyboard.volume = 0;

    startup.volume = 0;



    keyboard.play()
    .then(()=>{

        keyboard.pause();

        keyboard.currentTime = 0;

    });



    startup.play()
    .then(()=>{

        startup.pause();

        startup.currentTime = 0;

    });



    keyboard.volume = 0.35;

    startup.volume = 0.35;



    audioUnlocked = true;


}









/* ======================================================
   GAME DATABASE
====================================================== */

const games = {

    "JAGGED ALLIANCE": {

        title:"Jagged Alliance",

        developer:"Sir-Tech",

        release:"1994",

        engine:"DOSBox",

        executable:"C:\\GAMES\\JAGGED\\JA.EXE",

        zip:"https://github.com/R0T0-DEV/DOS-Library/releases/download/v1.0/ja.zip",

        description:
        "Classic turn-based tactical strategy game.\n\nHire mercenaries, liberate Meduna, and reclaim the island."

    },



    "THE ELDER SCROLLS ARENA": {

        title:"The Elder Scrolls: Arena",

        developer:"Bethesda Softworks",

        release:"1994",

        engine:"DOSBox",

        executable:"C:\\ARENA\\ACD.EXE",

        zip:"./games/arena.zip",

        description:
        "The first Elder Scrolls game.\n\nExplore the Empire, complete quests, and defeat Jagar Tharn."

    }

};

/* ======================================================
   LOGIN DATABASE
====================================================== */


const users = {

    "ADMIN":"DOS1994",

    "LUKE":"JAGGED"

};

let loginStage = "USERNAME";

let loginUser = "";

let loginPassword = "";

let loginInput = "";

/* ======================================================
   LOGIN SYSTEM
====================================================== */


function showLogin(){


    loginScreen.style.display="flex";


    loginPrompt.textContent =
    "USERNAME: ";


}




function processLogin(key){



    if(key === "Backspace"){


        loginInput =
        loginInput.slice(0,-1);


    }



    else if(key === "Enter"){


        if(loginStage === "USERNAME"){


            loginUser =
            loginInput;


            loginInput = "";


            loginStage =
            "PASSWORD";


            loginPrompt.textContent =
            "PASSWORD: ";



        }


        else{


            loginPassword =
            loginInput;



            authenticate();


        }


    }



    else if(key.length === 1){


        loginInput +=
        key.toUpperCase();


    }




    if(loginStage === "PASSWORD"){


        loginPrompt.textContent =
        "PASSWORD: " +
        "*".repeat(loginInput.length);


    }

    else{


        loginPrompt.textContent =
        "USERNAME: " +
        loginInput;


    }



}





function authenticate(){


    if(users[loginUser] === loginPassword){



        loginPrompt.textContent +=

        "\n\nACCESS GRANTED\n\nLOADING LIBRARY...";



        setTimeout(()=>{


            loginScreen.style.display="none";


            library.style.display="flex";


            library.classList.add("fadeIn");


            renderTerminal();



        },1500);



    }


    else{


        loginPrompt.textContent =

        "ACCESS DENIED\n\nINVALID LOGIN\n\n";



        loginUser="";

        loginPassword="";

        loginInput="";

        loginStage="USERNAME";



        setTimeout(()=>{


            loginPrompt.textContent =
            "USERNAME: ";


        },2000);



    }


}




let selectedGame = null;

launchButton.disabled = true;

dosContainer.innerHTML = "";

dosContainer.style.display = "none";

let command = "";

let terminalHistory = "";

let errorMessage = "";

let temporaryMessage = "";

let messageTimer = null;

let loadedGames = 0;

let launchTimer = null;

let dosInstance = null;









/* ======================================================
   INSTALLED GAME COUNTER
====================================================== */


function updateInstalledCounter(){


    if(!installedCount)
        return;



    if(loadedGames > 0){


        installedCount.textContent =
        "1 (+1 LOADED)";


    }

    else{


        installedCount.textContent =
        "1";


    }


}









/* ======================================================
   BIOS BOOT
====================================================== */


const bootLines = [

"American Megatrends BIOS v2.15",

"Copyright (C) 1985-1994 American Megatrends Inc.",

"",

"CPU: Intel Compatible Processor",

"Memory Test: 640K OK",

"Extended Memory: 16384K OK",

"",

"Detecting IDE Primary Master.....",

"GAME DRIVE FOUND",

"",

"Loading MS-DOS 6.22",

"",

"C:\\> GAME LIBRARY.EXE",

"",

"Starting DOS Game Library..."

];



let bootIndex = 0;




function bootSequence(){


    if(bootIndex < bootLines.length){


        bootText.textContent +=

        bootLines[bootIndex] + "\n";


        playSound(keyboard);


        bootIndex++;


        setTimeout(bootSequence,300);


    }

    else{


        finishBoot();


    }


}






function finishBoot(){


    setTimeout(()=>{


        playSound(startup);


        bootScreen.classList.add("fadeOut");


        setTimeout(()=>{


           bootScreen.style.display="none";


           showLogin();



        },1200);



    },500);


}






/* ======================================================
   POWER ON CLICK
====================================================== */


document.addEventListener("click",()=>{


    if(bootStarted)

        return;



    bootStarted = true;



    unlockAudio();



    bootSequence();


},{once:true});

/* ======================================================
   TERMINAL
====================================================== */


function renderTerminal(){

    let gameList = "";

    for(const key in games){

        gameList += `[${key}]\n\n`;

    }

    terminalText.innerHTML =

`C:\\GAMES\\

DOS GAME DATABASE

-----------------

AVAILABLE GAMES:

${gameList}
-----------------

TYPE GAME NAME TO LAUNCH

${temporaryMessage}

${errorMessage}

C:\\GAMES> ${command}<span id="cursor"></span>`;

}

/* ======================================================
   TEMPORARY TERMINAL MESSAGE
====================================================== */


function showTemporaryMessage(message){


    temporaryMessage = message;


    renderTerminal();



    clearTimeout(messageTimer);



    messageTimer = setTimeout(()=>{


        temporaryMessage = "";


        renderTerminal();


    },3000);


}








document.addEventListener("keydown",(event)=>{


    if(loginScreen.style.display === "flex"){

        processLogin(event.key);

        return;

    }


    let key = event.key;



    if(key.length === 1){


        errorMessage = "";


        temporaryMessage = "";


        command += key.toUpperCase();


        renderTerminal();


    }





    if(key === "Backspace"){


        command = command.slice(0,-1);


        renderTerminal();


    }





    if(key === "Enter"){


        executeCommand();


    }


});










/* ======================================================
   COMMAND EXECUTION
====================================================== */


function executeCommand(){


    let input = command.trim();



    if(games[input]){


        selectedGame = games[input];


        loadGame(selectedGame);



        showTemporaryMessage(

        `GAME FOUND: ${input}`

        );


    }


    else if(input.length > 0){


        errorMessage =

        `INVALID GAME NAME: ${input}`;



    }



    command = "";


    renderTerminal();


}









/* ======================================================
   GAME WINDOW
====================================================== */


function loadGame(game){

    gameTitle.textContent = game.title;

    developer.innerHTML =
    `<b>Developer</b><br>${game.developer}`;

    release.innerHTML =
    `<b>Release</b><br>${game.release}`;

    engine.innerHTML =
    `<b>Engine</b><br>${game.engine}`;

    status.innerHTML =
    `<b>Status</b><br>READY`;

    executable.innerHTML =
    `<b>Executable</b><br>${game.executable}`;

    description.textContent =
    game.description;

    launchButton.disabled = false;

    launchButton.textContent =
    "► LAUNCH GAME";

    closeGame.classList.remove("hidden");

}








/* ======================================================
   CLOSE GAME
====================================================== */


closeGame.addEventListener("click",()=>{


    /*
       FULL DOSBOX SHUTDOWN
       Stops emulator + audio
    */


    if(dosInstance){


        try{


            if(dosInstance.stop){

                dosInstance.stop();

            }


            else if(dosInstance.exit){

                dosInstance.exit();

            }


        }


        catch(error){


            console.log("DOSBox shutdown error:", error);


        }


    }






    if(dosContainer){


        dosContainer.innerHTML = "";


        dosContainer.style.display = "none";


    }



    rightPanel.classList.remove("gameRunning");



    dosInstance = null;



    loadedGames = 0;



    updateInstalledCounter();



    clearTimeout(launchTimer);





    selectedGame = null;



    closeGame.classList.add("hidden");





    gameTitle.textContent =

    "NO GAME SELECTED";





    developer.innerHTML =

    "<b>Status</b><br>WAITING FOR COMMAND";





    release.innerHTML =

    "<b>System</b><br>DOS GAME LIBRARY";





    engine.innerHTML =

    "<b>Games Installed</b><br>1";





    status.innerHTML =

    "<b>Status</b><br>NO SELECTION";





    executable.innerHTML =

    "<b>Executable</b><br>NONE";





    description.innerHTML =

    "Select a game from the terminal.<br><br>Type the full game name and press ENTER.";





    launchButton.disabled = true;



    launchButton.textContent =

    "► LAUNCH GAME";



});











/* ======================================================
   LAUNCH BUTTON
====================================================== */

launchButton.addEventListener("click",()=>{

    if(!selectedGame)
        return;

    /* Prevent launching a second game */

    if(dosInstance)
        return;

    launchButton.disabled = true;

    launchButton.textContent =
    "LOADING DOSBOX...";

    rightPanel.classList.add("gameRunning");

    loadedGames = 1;

    updateInstalledCounter();

    dosContainer.innerHTML = "";

    dosContainer.style.display = "block";



    dosInstance = Dos(dosContainer,{

        url:selectedGame.zip,

        autoStart:true

    });



    launchButton.textContent =
    "GAME RUNNING";

});












/* ======================================================
   INITIAL STATE
====================================================== */


window.addEventListener("load",()=>{


    library.style.display = "none";



    launchButton.disabled = true;



    closeGame.classList.add("hidden");



    dosContainer.style.display = "none";



    updateInstalledCounter();



    renderTerminal();



});
