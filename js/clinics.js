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

/*Start clincs*/
let clincs = document.querySelector("#clinics .container")
async function fetchClinics() {
    let response = await fetch("../APIs/clinics.json")
    let data = await response.json();
   return data;
}
let see_more = document.getElementById("more");
async function showClinics(num , clinic_name) {
   
    let data = await fetchClinics();
    if(data.length - num <= 0){
        see_more.style.display = "none";
    }
    data = data.slice(0 , num);
    
       
if(clinic_name){
    data = data.filter(clinic =>clinic.name.toLowerCase().includes(clinic_name))

}    
        clincs.innerHTML = "";
    
    if(data.length > 1){
        for(let i = 0 ; i<data.length ; i++){
            clincs.innerHTML += `
            <div class="box" onclick="addIdToStorage(${data[i].id})">
                <img src="${data[i].pohto}" alt="i img">
                <div class="content">
                    <h3>${data[i].name.split('-')[0].trim()}</h3>
                    <p>${data[i].description}</p>
                </div>
                <div class="info">
                    <a href="#">Read More</a>
                    <i class="fa-solid fa-right-long"></i>
                </div>
        </div>`
        }
    }else{
        clincs.innerHTML = "no clinics match";
        clincs.style.alignText = "center";
    }
   
}
let clinics_now = 8; 
showClinics(clinics_now);


see_more.addEventListener("click" , _=>{
    clinics_now+=8;
   showClinics(clinics_now)
}
)
let search = document.getElementById("search");
search.addEventListener("keyup" , e =>{
    showClinics(8 , e.target.value.toLowerCase())
    if(search.value.length > 0){
        see_more.style.display = "none";
    }else{
        see_more.style.display = "block";
    
    }
})
/*End clincs*/
/*Start Routing */
function addIdToStorage(clinic_id){
    localStorage.setItem("clinic_id" , clinic_id); 
    window.location.href = "info.html";
}
/*End Routing */

/*Start slider*/
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let images = document.querySelectorAll(".slider-container img");

next.addEventListener("click", _ => {
    for (let i = 0; i < images.length; i++) {
        if (images[i].classList.contains("active")) {
            images[i].classList.remove("active");
            let nextIndex = (i + 1 < images.length) ? i + 1 : 0;
            images[nextIndex].classList.add("active");
            break;
        }
    }
});
prev.addEventListener("click" , _ => {
    for(let  i = images.length -1  ; i>=0 ;i--){
        if(images[i].classList.contains("active")){
            images[i].classList.remove("active");
            let prevIndex = i == 0 ?  5 : i - 1;
            images[prevIndex].classList.add("active");
            break;
        }
    }
})
/*Start slider*/

/*Start Swiper */
document.addEventListener("DOMContentLoaded", () => {
	const sliders = document.querySelectorAll(".booking-slider");

	if (!sliders.length) return;

	const list = [];

	sliders.forEach((element) => {
		const [slider, prevEl, nextEl, pagination] = [
			element.querySelector(".swiper"),
			element.querySelector(".slider-nav__item_prev"),
			element.querySelector(".slider-nav__item_next"),
			element.querySelector(".slider-pagination")
		];

		list.push(
			new Swiper(slider, {
				slidesPerView: 1.15,
				spaceBetween: 20,
				slidesOffsetBefore: 20,
				slidesOffsetAfter: 20,
				speed: 600,
				observer: true,
				watchOverflow: true,
				watchSlidesProgress: true,
				navigation: { nextEl, prevEl, disabledClass: "disabled" },
				pagination: {
					el: pagination,
					type: "bullets",
					modifierClass: "slider-pagination",
					bulletClass: "slider-pagination__item",
					bulletActiveClass: "active",
					clickable: true
				},
				breakpoints: {
					575: {
						slidesPerView: 1.5
					},
					992: {
						slidesPerView: 2,
						slidesOffsetBefore: 0,
						slidesOffsetAfter: 0
					},
					1366: {
						slidesPerView: 3,
						spaceBetween: 40,
						slidesOffsetBefore: 0,
						slidesOffsetAfter: 0
					}
				}
			})
		);
	});
});
  
/*End Swiper */

/*Start Stat */
let stats = document.querySelectorAll(".stat-box h3");
let numbers = [...stats].map(stat => parseInt(stat.textContent.split("+")[1]) || 0);

function increaseStates(element, step, end) {
    let counter = 0;
    element.textContent = "+0";
    let interval = setInterval(() => {
        element.textContent = "+" + counter;
        counter += step;
        if (counter >= end) {
            element.textContent = "+" + end;
            clearInterval(interval);
        }
    }, 50);
}

let step = [1, 3, 75, 250];
let started = false;

window.addEventListener("scroll", () => {
    let triggerPoint = stats[0].parentElement.offsetTop ;

    if (window.scrollY > triggerPoint && !started) {
        
        for (let i = 0; i < stats.length; i++) {
            increaseStates(stats[i], step[i], numbers[i]);
        }
        started = true;
    }
});

/*End Stat */
