let type = document.getElementById("type");
let quote = document.getElementById("quote")
let file = document.getElementById("file")
let heroType = document.getElementById("heroType");
let heroTypeSelect = document.getElementById("heroTypeSelect")
let fileDesc = document.getElementsByClassName("file_desc")[0];
let dataType = document.getElementById("dataType");
type.addEventListener("change", function() {
    console.log(type.value === "Cytat")
    if(type.value == "Cytat"){
        quote.removeAttribute("class", "d-none");
        heroType.setAttribute("class", "d-none");
        file.setAttribute("class", "d-none");
        dataType.setAttribute("class", "d-none");
    } else if(type.value === "Kadr"){
        quote.setAttribute("class", "d-none");
        heroType.setAttribute("class", "d-none");
        file.removeAttribute("class", "d-none");
        fileDesc.innerText = "Dodaj zdjęcie kadru";
        dataType.setAttribute("class", "d-none");
    } else if(type.value === "Postacie"){
        quote.setAttribute("class", "d-none");
        heroType.removeAttribute("class", "d-none");
        file.setAttribute("class", "d-none");
        dataType.setAttribute("class", "d-none");
    } else if(type.value === "Data produkcji"){
        quote.setAttribute("class", "d-none");
        heroType.setAttribute("class", "d-none");
        file.setAttribute("class", "d-none");
        dataType.removeAttribute("class", "d-none");
    } else if(type.value === "Soundtrack"){
        quote.setAttribute("class", "d-none");
        heroType.setAttribute("class", "d-none");
        file.removeAttribute("class", "d-none");
        fileDesc.innerText = "Dodaj plik mp3 soundtracku";
        dataType.setAttribute("class", "d-none");
    } else if(type.value === "Piosenka"){
        quote.setAttribute("class", "d-none");
        heroType.setAttribute("class", "d-none");
        file.removeAttribute("class", "d-none");
        fileDesc.innerText = "Dodaj plik mp3 piosenki";
        dataType.setAttribute("class", "d-none");
    }
})

heroTypeSelect.addEventListener("change", function(){
    if(heroTypeSelect.value === "Zdjęcie bohatera"){
        quote.setAttribute("class", "d-none");
        heroType.removeAttribute("class", "d-none");
        file.removeAttribute("class", "d-none");
        fileDesc.innerText = "Dodaj zdjęcie bohatera";
    } else {
        quote.setAttribute("class", "d-none");
        heroType.removeAttribute("class", "d-none");
        file.setAttribute("class", "d-none");
    }
})