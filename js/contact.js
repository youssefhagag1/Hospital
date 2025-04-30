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

burger.addEventListener("click" , showNav);
function showNav(){
    main_nav.classList.toggle("active")
    burger.classList.toggle("active")
}