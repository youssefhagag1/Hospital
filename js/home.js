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

/*Start Observer Fade */
const elements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

elements.forEach(el => {
  observer.observe(el);
});
/*End Observer Fade */

/*Start clincs*/
let clincs = document.querySelector("#clinics .container")
async function fetchClinics() {
    let response = await fetch("../APIs/clinics.json")
    let data = await response.json();
   return data;
}
async function showClinics() {
    let data = await fetchClinics();
   data = data.slice(0 , 8)
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
}
showClinics();
function addIdToStorage(clinic_id){
    localStorage.setItem("clinic_id" , clinic_id); 
    window.location.href = "info.html";
}
/*End clincs*/

/* Start Events */
let event_title = document.querySelector(".events .title");
let event_description = document.querySelector(".events .description");
let event_img = document.querySelector(".events img");
let days = document.getElementById("days");
let hours = document.getElementById("hours");
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");

fetch("../APIs/event.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("can't fetch api");
    }
    return response.json();
  })
  .then(data => {
    // عرض بيانات الحدث
    event_title.textContent = data.name;
    event_description.textContent = data.description;
    event_img.src = data.img;

    // تحديد تاريخ الحدث
    let eventDate = new Date(
      data.date.year,
      data.date.month - 1, // الشهر في JavaScript يبدأ من 0
      data.date.day,
      data.date.hour,
      data.date.min,
      data.date.sec
    );

    // العد التنازلي
    let timer = setInterval(() => {
      let now = new Date();
      let diff = eventDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        days.textContent = "0";
        hours.textContent = "0";
        minutes.textContent = "0";
        seconds.textContent = "0";
        console.log("event now");
        return;
      }

      let d = Math.floor(diff / (1000 * 60 * 60 * 24));
      let h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let s = Math.floor((diff % (1000 * 60)) / 1000);

      days.textContent = d;
      hours.textContent = h;
      minutes.textContent = m;
      seconds.textContent = s;
    }, 1000);
  })
  .catch(err => console.error(err));

  let email = document.getElementById("email");
  let subscribe_btn = document.getElementById("subscribe_btn");
  subscribe_btn.addEventListener("click", e => {
    let email_value = email.value;
    e.preventDefault();
    if(email_value !== ""){
        let data = new FormData();
        data.append("email" , email_value);
        fetch("http://127.0.0.1:8000/api/event/register/1" , {
            method : "Post",
            body : data
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Can't fetch Api");
            }
            return response.json();
        })
        .then(_ => {
            subscribe_btn.value = "Subscribed";
            subscribe_btn.style.backgroundColor = "#4caf50";

        })
        .catch(error => console.log(error))
        .finally(_ => email.value = "");
    }

  })

/* End Events */



/*Start photoWrapper*/
const photos = Array.from(document.getElementsByClassName("photo"));
const photoWrapper = document.getElementById("photoWrapper");

let count = 0;
photos.forEach((photo) => {
    count++;
    if (count % 2) {
        photo.classList.add("even");
    }
});

photoWrapper.addEventListener("scroll", () => {
    photos.forEach(checkPosition);
});

function checkPosition(photo) {
    if (photo.getBoundingClientRect().right - 4 <= 0) {
        photo.remove();
        photoWrapper.append(photo);
        photoWrapper.scrollLeft = 0;
        return;
    }
}

function infiniteScroll() {
    photoWrapper.scrollLeft++;
    requestAnimationFrame(infiniteScroll);
}

infiniteScroll();
/*End photoWrapper*/

/*Start Pricing */
let pricing_btns = document.querySelectorAll(".pricing .box button");
pricing_btns.forEach((_  , index)=>{
    pricing_btns[index].addEventListener("click" , _=>{
        let title = pricing_btns[index].parentElement.childNodes[1].textContent;
        localStorage.setItem("plan_id" , index+1);
        localStorage.setItem("plan_title" , title);
        location.href = "pricing.html";
    })
});
/*Start Pricing */


/*Start dontion Form */
let name_input = document.getElementById("name");
let phone_input = document.getElementById("phone");
let national_id_input = document.getElementById("national_id");
let value_input = document.getElementById("value");
let currency_input = document.getElementById("currency");
let submit_btn = document.getElementById("submit");

submit_btn.addEventListener("click" , e => {
    e.preventDefault();
    let name_input_value = name_input.value;
    let phone_input_value = phone_input.value;
    let national_id_value = national_id_input.value;
    let value_input_value = value_input.value;
    let currency_input_value = currency_input.value;
    if (name_input_value && phone_input_value && national_id_value && value_input_value && currency_input_value){
        submit_btn.innerHTML = "<span class='loader'></span>";
        let data = new FormData();
        data.append("name" ,name_input_value);
        data.append("phone" ,phone_input_value);
        data.append("national_id" ,national_id_value);
        data.append("value" ,value_input_value);
        data.append("currency" ,currency_input_value);
        fetch("http://127.0.0.1:8000/api/donate" , {
            method : "Post",
            body : data
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Cant not featc api");
            }
            return response.json();
        })
        .then(data => {
            location.href = data.link;
            name_input.value = "";
            phone_input.value = "";
            national_id_input.value = "";
            value_input.value = "";
            currency_input.value = "";
        })
        .catch(error => console.log(error));
    } 
})
/*End dontion Form */