"use strict";

const setup = async () => {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
         "username": "sabuein",
         "password": "0123456789"
       });
       
       //let bodyContent = "sab=ssss&aaa=aaa";

       let response = await fetch("http://localhost:3000/v1/setup?username=sabuein", { 
         method: "GET",
         body: bodyContent,
         headers: headersList
       });
       
       let data = await response.text();
       console.log(data);
       
};

export default setup;

let headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Content-Type": "application/x-www-form-urlencoded"
 }
 
 
 let response = await fetch("http://localhost:3000/v1/setup", { 
   method: "GET",
   body: bodyContent,
   headers: headersList
 });
 
 let data = await response.text();
 console.log(data);