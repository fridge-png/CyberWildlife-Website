// this function is called if the user enters their profile and did not set an profile image yet
function getAltImage(){
    document.getElementById("profilepic").src="/uploads/altImage.png";
}

// this function is called when the user wants to delete an experience
// the user is asked to confirm 
function confirmdelete(){
    //popup to confirm deletion
    const con = confirm("Are you sure you want to delete your experience?");
    if(con==false){
        return false;
    }
    else{
        return true;
    }
}

// this function is called when the user wants to add a new experience
// the plus button is hidden and the form is shown
function showForm(){
    document.getElementById("form").style.display= "block";
    document.getElementById("expform").style.display= "grid";
    document.getElementById("plus").style.display="none";
}

// this function is called when the user inputs a species name and clicks on get information
// information about the selected animal will be displayed if found in the API
function getAPI(){

        const xhttp = new XMLHttpRequest();

        // getting the species name from input
        let name = document.getElementById("species").value;
        // converting the name to a format that fits the API url
        name = changeToStringQuery(name);

        // opening a get request with the input name
        xhttp.open("get", "https://ecos.fws.gov/ecp/pullreports/catalog/species/report/species/export?format=json&columns=%2Fspecies%40cn%2Cdesc%2Cstatus%2Ccountry%2Cshapefile_last_updated%2Csn%2Cgn%3B%2Fspecies%2Ftaxonomy%40family&filter=%2Fspecies%40cn%20%3D%20%27" + name + "%27", true); 
   
        // send the request
        xhttp.send();

        xhttp.onload = ()=> {

                // parsing the response into a json object
                let jsonObj=JSON.parse(xhttp.response);
                // checking if the request returned anything
                if(jsonObj.data[0]!=null){
                    let speciesObj = jsonObj.data;

                    // getting values from the response
                    const name = speciesObj[0][0];
                    const status = speciesObj[0][2];
                    const loc = speciesObj[0][1];
                    const scien = speciesObj[0][5].value;
                    const fam = speciesObj[0][7];

                    // manipulating the DOM to display the information recieved
                    document.getElementById("info").style.display = "grid";
                    let list = document.getElementsByClassName("name");
                    for (var i = 0; i < list.length; i++) {
                            list[i].innerHTML= name;
                    }
                    document.getElementById("scien").innerHTML=scien;
                    document.getElementById("status").innerHTML=status;
                    document.getElementById("tax").innerHTML=fam;
                    document.getElementById("loc").innerHTML="[" + loc + "]";

                    // styling the elements depending on the status of the species
                    if(speciesObj[0][2].toUpperCase().includes("THREATENED") || speciesObj[0][2].toUpperCase().includes("ENDANGERED")){
                        
                        document.getElementById("status").style.color = "red";}
                        
                    else{
                        document.getElementById("status").style.color = "green";
                    }

            }

        }  
        
    }

// this function is used in the getAPI() method to change the input string into a format suitable for the API 
function changeToStringQuery(name){
    name = name.replaceAll(' ',"%20")
    name = name.replaceAll('\'',"%27");
    return name;
}

// api call to get timestamp of profile
function getInfoAPI(){

    const xhttp = new XMLHttpRequest();


    // opening a get request with the input name
    xhttp.open("get", "http://localhost:8081/getProfileInfo", true); 

    // send the request
    xhttp.send();

    xhttp.onload = ()=> {

            const timestamp = xhttp.response.substring(1,11);
            document.getElementById("timestamp").innerHTML="Account created: " + timestamp;

        }

    }  
    

// this function is called when the user activates the sign in tab
function toggleSignIn(){
    const signinform = document.getElementById("signinform");
    const signupform = document.getElementById("signupform");

    signinform.style.display = "grid";
    signupform.style.display = "none";

    document.getElementById("signinbutton").classList.remove("inactive");
    document.getElementById("signupbutton").classList.add("inactive");
}

// this function is called when the user activates the sign up tab
function toggleSignUp(){
    const signinform = document.getElementById("signinform");
    const signupform = document.getElementById("signupform");

    signinform.style.display = "none";
    signupform.style.display = "grid";

    document.getElementById("signupbutton").classList.remove("inactive");
    document.getElementById("signinbutton").classList.add("inactive");
}