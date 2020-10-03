console.log("Client side JS file is loaded");



const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

// console.log(messageOne.value)

weatherForm.addEventListener("submit", (e) => {
    
    const location = search.value;

    fetch("http://localhost:3000/weather?address="  + location )
        .then(response => response.json())
        .then(data => {
            if(data.error){
                messageOne.textContent = data.error
            }else{
                messageTwo.textContent = data.location + " -- " + data.forecast;
                // console.log(`${data.location}`);
                // console.log(`${data.forecast}`);
            }  
        });
    

    e.preventDefault();
});
