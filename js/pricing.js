let top_div = document.getElementById("top");

let main_nav = document.getElementById("main-nav");

let burger = document.getElementById("burger");

/*Start Scroll to top */
window.onscroll = function(){
    if(window.scrollY >= 760){
        top_div.style.display = "block";
    }
    else{
        top_div.style.display = "none";
 
    }
}
top_div.addEventListener("click" , _=> {
window.scrollTo({
    top : 0 
})
})

/*End Scroll to top */
/*Start Nav */

burger.addEventListener("click" , showNav);
function showNav(){
    main_nav.classList.toggle("active")
    burger.classList.toggle("active")
}
/*End Nav */

/*Start Plan form */
let title  = document.getElementById("title");
title.textContent = localStorage.getItem("plan_title");

let plan_form = document.getElementById("plan_form");
let submit_btn = document.getElementById("submit");

let plan_id = localStorage.getItem("plan_id");
submit_btn.addEventListener("click" , e=> {
e.preventDefault();
let complete = true;
let data = new FormData(plan_form);
data.append("payment_method" , "online");

let inputs = plan_form.getElementsByClassName("input");
for(let i = 0 ; i< inputs.length ;i++){
    if(inputs[i].value ==""){
        complete = false;
        break;
    }
}
if(complete){
    submit_btn.innerHTML = "<span class='loader'></span>";
    fetch(`http://127.0.0.1:8000/api/subscribe/${plan_id}` , {
        method : "Post",
        body : data
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Can't fetch api");
        }
        return response.json();
    })
    .then(data => {
        location.href = data.link;
    })
    .catch(error => console.log(error))
  
}
})
/*End Plan form */