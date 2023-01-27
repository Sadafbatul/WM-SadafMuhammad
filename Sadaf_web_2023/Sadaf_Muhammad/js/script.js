(function(){
	"use strict";
	/*jslint browser: true*/
	/*jslint devel: true*/
	let baseApiAddress = "https://zakki.be/WM---ZakariaBouhlala---Logboek---2022-/Opdracht1/api/";
	
	let alertEl = document.getElementById("alert");
	let opties = {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "omit" // include, *same-origin, omit
		/* Opgelet : volgende headers niet toevoegen :
		   JSON triggert de pre-flight mode, waardoor de toegang op
		   deze manier niet meer zal lukken.
		*/
		/*, headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}*/
	};
	
    function getVakken(){
        let vakken = new Array();
        let url = baseApiAddress + "STUDENTSget.php";


        // test de api
        fetch(url, opties)
            .then(function(response) {
                return response.json();
            })
            .then(function(responseData){
                let list = responseData.data;

            
                    for (let i = 0; i < list.length; i++) {
                        GetStudenten(list[i].code);
                    }

            })
            .catch(function(error) {
                // verwerk de fout
                console.log("fout" + error);

            });
    }


    getVakken();





function GetStudenten(code){

    let url2 = baseApiAddress + "VAKget.php";
        
    opties.body = JSON.stringify({
        vak: code
    });

    fetch(url2, opties)
        .then(function(response) {
            console.log(response.json);
            
            return response.json();
        })
        .then(function(responseData){
            
            let list = responseData.data;

            MaakTabel(list);
        })
        .catch(function(error) {
            alert("Fout: " + error);
        });
}




function VerzamelInfo(){
  let voornaam = prompt("Voornaam: :");
  let familienaam = prompt("Familienaam: ");
  let studentennummer = prompt("studentennummer: ");
  let student = {Voornaam:voornaam, Familienaam:familienaam, Studentennummer:studentennummer};
  return student;
}


// Deze functie maakt de tabellen aan a.d.h.v de vak code. Elke vak krijgt zijn tabel met een lijst studenten. 
function MaakTabel(studenten){
    
    // De header van de tabel aanmaken
    let tabel = "<div data-code="+studenten[0].code+" class='tabel'><span class='header'>"+studenten[0].naam+"</span><span class='opties'>:</span>";
    tabel += "<br>";
    tabel += "<span class='rij kOdd'><span>Studentennr</span><span>Voornaam</span><span>Familienaam</span><span>Vak_code</span></span>";

    if (studenten.length > 0) {

            // Tabel vullen met de studenten
            for (let i = 0; i < studenten.length; i++) {
                if(studenten[i].studentennummer != null){

                    tabel += "<span data-voornaam="+studenten[i].voornaam+" data-familienaam="+studenten[i].familienaam+" data-studentennummer="+studenten[i].studentennummer+" data-vakcode="+studenten[i].code+" class='rijData'><span>" +                                studenten[i].studentennummer + "</span><span>" + studenten[i].voornaam +"</span><span>" + studenten[i].familienaam +"</span><span>" + studenten[i].code +"</span></span>";    
                }  
            }
            
        tabel += "</div>";
        alertEl.innerHTML += tabel;



        let tabellen = document.querySelectorAll('.tabel');

        // Opties
        let buttons = "<div class='kader'><button id='btnToevoegen'>student toevoegen</button><button id='btnVerwijderen'>student verwijderen</button><button id='btnVakVerwijderen'>vak verwijderen</button></div>";

        // Verzameling van alle studenten van de kolom
        let rijen = document.querySelectorAll('span.rijData');


        let geselecteerd = false; // geeft aan of de gebruiker een rij geselecteerd heeft
        
        let studentnummer;
        let vakCodeRij;
        let codeTabel; // geeft aan op welke tabel gefocust is

        for(let i = 0; i < rijen.length; i++){
            
            rijen[i].addEventListener("click", function() {
            
                rijen.forEach(Element => {
                        Element.classList.remove('geklikt');
                });      

                studentnummer = rijen[i].getAttribute("data-studentennummer");
                vakCodeRij = rijen[i].getAttribute("data-vakcode");
                geselecteerd = true;

                rijen[i].classList.add('geklikt');
            
                let voornaam = rijen[i].getAttribute("data-voornaam");
                let familienaam = rijen[i].getAttribute("data-familienaam");

                let textVoornaam = document.querySelector("#studentVoornaam");
                let textFamilienaam = document.querySelector("#studentFamilienaam");
                let textStudentennummer = document.querySelector("#studentStudentennummer");

                textVoornaam.value = voornaam;
                textFamilienaam.value = familienaam;
                textStudentennummer.value = studentnummer;

                document.querySelector("form#formWijzigen").classList.add("visible");
                document.querySelector("#btnWijzigen").addEventListener("click", function() {
                    StudentUpdaten(textVoornaam.value, textFamilienaam.value, textStudentennummer.value,  studentnummer);
                })
            })

         
        }

        for(let i = 0; i < tabellen.length; i++){

            tabellen[i].addEventListener("click", function(e) {
                if(e.target.classList.contains('opties')){
                    tabellen[i].querySelector('.opties').innerHTML = buttons;
                    codeTabel = tabellen[i].getAttribute("data-code");
                
                    // Student toevoegen
                    tabellen[i].querySelector('.opties #btnToevoegen').addEventListener("click", function() {
                        let student = VerzamelInfo();

                        StudentToevoegen(student.Voornaam, student.Familienaam, student.Studentennummer, codeTabel);
                        alertEl.innerHTML = "";
                        getVakken();
                    }) 

                    // Student verwijderen
                    tabellen[i].querySelector('.opties #btnVerwijderen').addEventListener("click", function() {
                        if(geselecteerd == true && vakCodeRij == codeTabel){
                            StudentVerwijderen(studentnummer, vakCodeRij);
                            alertEl.innerHTML = "";
                            getVakken();
                            alert(`student met studentennummer ${studentnummer} is succesvol verwijderd`);
                        }
                    })

                    // Vak verwijderen
                    tabellen[i].querySelector('.opties #btnVakVerwijderen').addEventListener("click", function() {
                        VakVerwijderen(codeTabel);
                        
                        let studenten = tabellen[i].querySelectorAll('span.rijData');
                        
                        for(let i = 0; i < studenten.length; i++){
                            StudentVerwijderen(studenten[i].getAttribute("data-studentennummer"), studenten[i].getAttribute("data-vakcode"));
                        }
                        alertEl.innerHTML = "";
                        getVakken();
                    })


                }
                else{
                    tabellen[i].querySelector('.opties').innerHTML = ":";
                }
            })


    }} 
    else {
        alert("Geen data aanwezig");
    }
}




document.getElementById("btnVerzenden").addEventListener("click", function() {

    if(document.getElementById("Vaknaam").value != "" && document.getElementById("VakCode").value != "" && document.getElementById("VakTaal").value != "" )
    {
        VakToevoegen(document.getElementById("Vaknaam").value, document.getElementById("VakCode").value, document.getElementById("VakTaal").value);
    }
    else
    {
        alert("Gelieve alle gegevens in te vullen");
        return;
    }
})


// TOEVOEGEN ////////////////////////


function VakToevoegen(naamV, codeV, taalV){
    
    let url = baseApiAddress + "VAKinsert.php";
    
    opties.body = JSON.stringify({
        naam: naamV,
        code: codeV,
        taal: taalV
    }); 
    


    fetch(url, opties)
    .then(function(response) {
        alert("Vak is succesvol toegevoegd aan deze vak");
    })
    .catch(function(error) {
        alert("fout: " + error);
    });

}

function StudentToevoegen(voornaamV, familienaamV, studentennummerV, vakCodeV) {

    let url = baseApiAddress + "STUDENTinsert.php";
    
    opties.body = JSON.stringify({
        voornaam: voornaamV,
        familienaam: familienaamV,
        studentennummer: studentennummerV,
        vak_code: vakCodeV
    }); 
    

    fetch(url, opties)
    .then(function(response) {
        alert("student is succesvol toegevoegd aan deze vak");
    })
    .catch(function(error) {
        alert("fout: " + error);
    });

}

// VERWIJDEREN ////////////////////////

function StudentVerwijderen(studentennummerV, vakCodeV){

    let url = baseApiAddress + "STUDENTdelete.php";
		
    opties.body = JSON.stringify({
        studentennummer: studentennummerV,
        vak_code: vakCodeV
    }); 


    fetch(url, opties)
    .then(function(response) {
        return;  
    })
    .catch(function(error) {
        alert("fout: " + error);
    });

}




function VakVerwijderen(codeV){
    let url = baseApiAddress + "VAKdelete.php";
    
    opties.body = JSON.stringify({
        code: codeV
    }); 
    

    fetch(url, opties)
    .then(function(response) {
        alert("VAK is succesvol verwijderd");
    })
    .catch(function(error) {
        alert("Fout: " + error);
    });

}


function StudentUpdaten(voornaamV, familienaamV, nieuwStudentennummerV, studentennummerV){
    let url = baseApiAddress + "STUDENTupdate.php";
		
    opties.body = JSON.stringify({
        voornaam: voornaamV,
        familienaam: familienaamV,
        nieuwStudentennummer: nieuwStudentennummerV, 
        studentennummer: studentennummerV
    }); 


    fetch(url, opties)
    .then(function(response) {
        alert("Student is succesvol geüpdatet");
    })
    .catch(function(error) {
        alert("fout: " + error);
    });

}

})();


