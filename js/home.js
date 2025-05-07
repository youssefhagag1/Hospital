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


/*Start Chat */
let currentUUID = null;
let currentId = null; 
let chat  = document.getElementById("chat");
let chat_container = document.createElement("div");
chat_container.setAttribute("class" , "chatContainer");
chat_container.setAttribute("id" , "chat_container")
let form_name = document.createElement("form");
form_name.setAttribute("id" , "requestForm");
form_name.classList.add("requestForm");



let requested_name = document.createElement("input");
requested_name.name = "name";
requested_name.required = true;
requested_name.placeholder = "Your Name";
requested_name.classList.add("PatientName");

let send_name = document.createElement("button");
send_name.textContent = "Send";
send_name.classList.add("sendName");


form_name.appendChild(requested_name);
form_name.appendChild(send_name);

let close_btn = document.createElement("button");
close_btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
close_btn.classList.add("close");
chat_container.appendChild(close_btn);

chat_container.appendChild(form_name);

document.body.appendChild(chat_container);
let uuid = localStorage.getItem("uuid");
let chatId = localStorage.getItem("chatId");
let done = false;
chat.addEventListener("click", _ => {
    chat_container.setAttribute("class" , "active chatContainer");
    if(uuid && chatId) {
        
        startChat(uuid , chatId);
        if(!done) {
            changeUi(uuid);
            done = true;
        }
    }
    
});
close_btn.addEventListener("click", _ => {
    chat_container.classList.remove("active");
});

send_name.addEventListener("click" , e => {
    e.preventDefault();
    if(requested_name.value !== ""){
        let request = new FormData(form_name);
    fetch("http://127.0.0.1:8000/api/request/chat" , {
        method : "Post",
        body : request
    })
    .then(response => {
        if(!response.ok){
            throw new Error("cant fetch");
        }
        return response.json();
    })
    .then(data => {
            console.log(data);
            currentUUID =data.chat.uuid;
            currentId = data.chat.id; 
            localStorage.setItem("uuid" , currentUUID);
            localStorage.setItem("chatId" , currentId);
            changeUi();
            startChat(currentUUID , currentId)
        
    })
    .catch(error => console.log(error));
    }
})
async function changeUi(uuid){
    form_name.remove();
   
    let receptionist = document.createElement("div");
    receptionist.classList.add("receptionist");

    let receptionist_title = document.createElement("h2");
    receptionist_title.textContent = "receptionist";

    let receptionist_img = document.createElement("img"); 
    receptionist_img.src = "../assets/hospital-reception.png";
    receptionist_img.alt = "i image";

    receptionist.appendChild(receptionist_img);
    receptionist.appendChild(receptionist_title);

    chat_container.appendChild(receptionist);

    let messageForm = document.createElement("form");
    messageForm.classList.add("messageForm");

    let message_input = document.createElement("input");
    message_input.focus();
    message_input.name = "message";
    message_input.required = "true";
    message_input.classList.add("messageInput");
    message_input.setAttribute("id" , "messageInput");
    message_input.placeholder = "Message";

    let message_btn = document.createElement("button");
    message_btn.classList.add("message_btn");
    message_btn.setAttribute("id" , "sendMessage");
    message_btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i>';

    messageForm.appendChild(message_input);
    messageForm.appendChild(message_btn);
    chat_container.appendChild(messageForm);

    if(uuid){
    try {
        let response = await fetch(`http://127.0.0.1:8000/api/chat/${uuid}`);
        let data = await response.json();
        let messages = data.chat.messages;
        for(let i = 0 ; i< messages.length ; i++) {
            showInUi(messages[i].message , messages[i].sendedBy);
        }
    } catch(error) {
        console.log(error);
    }
    }
    
   message_btn.addEventListener("click" , e=> {
    e.preventDefault();
    let message_value = message_input.value;
        if(message_value != ""){
            const messageData = new FormData();
            messageData.append("uuid" , uuid || currentUUID);
            messageData.append("message" , message_value);
            fetch("http://127.0.0.1:8000/api/send" , {
                method: "post",
                body : messageData
            })
            .then(response => {
                if(!response.ok){
                    throw new Error("cant fetch");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                message_input.value = "";
            })
            .catch(error => console.log(error));
        }
    })
}

function startChat(uuid ,id){
    let pusher = new Pusher("caa359463e78926e217b" , {
        cluster : "eu",
        encrypted : true
    })
    pusher.connection.bind("connected" , _=> {
        console.log("pusher connected successfully");
    })
    pusher.connection.bind("error" , error => {
        console.log("pusher not connected" , error)
    })
    let channel = pusher.subscribe(`message-sended${id}`);

    channel.bind("message.sended" , data => {
        if(data && data.message) {
            console.log(data)
            showInUi(data.message.message , data.message.sendedBy );
        }else {
            console.log("message data missing");
        }
    })
}
let messages = document.createElement("div");
function showInUi(message , sendedBy ){
    messages.classList.add("messages");
    let oneMessage = document.createElement("div");
    oneMessage.classList.add("message");
    oneMessage.textContent = message;
    if(sendedBy == "sender"){
        oneMessage.classList.add("sender");
        
    }else {
        oneMessage.classList.add("user");

    }
    messages.appendChild(oneMessage);
    chat_container.appendChild(messages);
    messages.scrollTop = messages.scrollHeight;
}
/*End Chat */


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