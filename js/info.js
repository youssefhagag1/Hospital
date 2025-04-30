
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

/*Start Navbar */
burger.addEventListener("click" , showNav);
function showNav(){
    main_nav.classList.toggle("active")
    burger.classList.toggle("active")
}
/*End Navbar */
let clinic_id = localStorage.getItem("clinic_id");
async function fetchClinic(){
    try{
        let response = await fetch(`../APIs/clinic/${clinic_id}`);
        if(!response.ok){
            throw new Error("Can't featch api");
        }
        let data = await response.json();
        showData(data);
        showDoctors(data);
        console.log(data);
    }catch(err){
        console.log("Error :" , err)
    }
}
let clinic_Data = document.querySelector("#clinic_Data .container");
let clinic_name = document.getElementById("clinic_name");
let clinic_description = document.getElementById("clinic_description");
let clinic_place = document.getElementById("clinic_place");
let clinic_swiper = document.getElementById("clinic_swiper");

function showData(data){
    document.title = data.name.split("-")[0] ;
    clinic_name.textContent =  data.name.split("-")[0];
    clinic_description.textContent = data.description;
    clinic_place.innerHTML = "<i class='fa-solid fa-location-dot'></i>" + data.place;
    for(let i = 0 ; i<data.photo.length ;i++ ){
        
        let slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.style.backgroundImage = `url('${data.photo[i]}')`;
        slide.style.borderRadius = "20px";
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        clinic_swiper.appendChild(slide);
    }
}
let doctors = document.querySelector(".doctors .container")
function showDoctors(data){
  for(let i = 0 ; i<data.doctors.length ;i++){
    doctors.innerHTML += `
    <div class="box" onclick="redirectToAppointment(${data.doctors[i].id})">
            <div class="image">
                <img src="${data.doctors[i].profile}" alt="i image">
            </div>
            <div class="info">
                <div class="data">
                    <h2 class="doctor_name">${data.doctors[i].name}</h2>
                    <span class="doctor_specialty"> <i class="fa-solid fa-user-doctor"></i>${data.doctors[i].specialty}</span>
                    <span class="doctor_experiance"><i class="fa-solid fa-layer-group"></i> ${data.doctors[i].experiance}</span>
                    <span class="doctor_price"><i class="fa-solid fa-money-bill-1-wave"></i> ${data.doctors[i].price}</span>
                </div>
                <div class="appointmet">
                    Make An Appointmet
                    <a class="icon"><i class="fa-solid fa-arrow-up"></i></a>
                </div>
            </div>
        </div>
    `
  }
}
fetchClinic();
function redirectToAppointment(doctor_id){
  localStorage.setItem("doctor_id" , doctor_id);
  window.location.href = "appointment.html";
}

new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 3,
      slideShadows: true
    },
    keyboard: {
      enabled: true
    },
    mousewheel: {
      thresholdDelta: 70
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 1
      },
      1024: {
        slidesPerView: 2
      },
      1560: {
        slidesPerView: 3
      }
    }
  });
  
