"use strict";

import {
  OPTIONS,
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  TRACE,
  CONNECT,
  PATCH
} from "./methods.mjs";

const logMeIn = async () => {
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Content-Type": "application/json"
   }
   
   let bodyContent = JSON.stringify({
     "username": "sabuein",
     "email": "sabuein@gmail.com",
     "password": "0123456789"
   });
   
   let response = await fetch("http://localhost:3000/v1/access/login", { 
     method: "POST",
     body: bodyContent,
     headers: headersList
   });
   
   let data = await response.text();
   console.log(data);       
};

export default logMeIn;