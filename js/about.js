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


burger.addEventListener("click" , showNav);
function showNav(){
    main_nav.classList.toggle("active")
    burger.classList.toggle("active")
}
/*End Scroll to top */

/*Start video */
let video = document.getElementById("video");
let about = document.querySelector(".about-second");
video.addEventListener("click" , _ => {
  let iframe = document.createElement("iframe");
  iframe.classList.add("iframe");
  let cont = document.createElement("div");
  let cancle = document.createElement("div");
  cancle.classList.add("cancle");
  cancle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  cont.classList.add("cont");
  iframe.src = "https://www.youtube.com/embed/2Rc9zTp0X00?si=WHtD0VIk5SgV_UFR";
  // iframe.width = "560";
  // iframe.height = "315";
  about.style.position = "relative";
  cont.appendChild(iframe);
  cont.appendChild(cancle);
  about.appendChild(cont);
  cancle.onclick = function(){
    cont.remove();
  }
})
/*End video */

