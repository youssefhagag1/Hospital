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


/*Start Form */

let name_input = document.getElementById("name");
let phone_input = document.getElementById("phone");
let age_input = document.getElementById("age");
let national_id_input = document.getElementById("national_id");
let gender = document.getElementById("gender");
let day = document.getElementById("day");
let date_input = document.getElementById("date");
let type_input = document.getElementById("type");
let payment_method = document.getElementById("payment_method");
let submit_btn = document.getElementById("submit");

let doctor_id = localStorage.getItem("doctor_id");

let api = `http://127.0.0.1:8000/api/doctor/${doctor_id}`;

async function fetchDoctor(api) {
    try {
        let response = await fetch(api);
        if (!response.ok) {
            throw new Error(`can't fetch ${api}`);
        }
        let data = await response.json();
        setTimeTable(data);
    } catch (error) {
        console.log(error);
    }
}
fetchDoctor(api);



function setTimeTable(data) {
    for (let i in data.timeTable) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i + " : " + data.timeTable[i];
        day.appendChild(option);
    }
}

date_input.addEventListener("change", function () {
    let selectedDay = day.value;
    if (!selectedDay) return; // Skip if no day is selected

    let selectedDate = new Date(this.value);
    console.log(selectedDate);
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dateDay = daysOfWeek[selectedDate.getDay()];

    if (selectedDay !== dateDay) {
        alert(`The selected date is a ${dateDay}, not a ${selectedDay}. Please choose a correct date.`);
        this.value = ""; // Reset the date input
    }
});

let appointment_api = "http://127.0.0.1:8000/api/appointment/create";

submit_btn.addEventListener("click", e => {
    e.preventDefault(); 
    
    let name_value = name_input.value;
    let phone_value = phone_input.value;
    let age_value = age_input.value;
    let gender_value = gender.value;
    let day_value = day.value; 
    let date_value = date_input.value;
    let type_value = type_input.value;
    let payment_method_value = payment_method.value;
    let national_id_value = national_id_input.value
    
    if(name_value && phone_value && age_value && gender_value && day_value && date_value && type_value && payment_method_value && national_id_value ){
    submit_btn.innerHTML = "<span class='loader'></span>";
    let data_inputs = new FormData();
    data_inputs.append("doctor_id", doctor_id); 
    data_inputs.append("name", name_value);
    data_inputs.append("phone", phone_value);
    data_inputs.append("national_id" , national_id_value)
    data_inputs.append("age", age_value);
    data_inputs.append("gender", gender_value);
    data_inputs.append("day", day_value);
    data_inputs.append("date", date_value);
    data_inputs.append("type", type_value);
    data_inputs.append("payment_method", payment_method_value);

    fetch(appointment_api, {
        method: "POST",
        body: data_inputs
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Can't fetch API");
        }
        return response.json(); 
    })
    .then(data => {
        if(payment_method_value === "cash"){
            submit_btn.style.cssText = `
            background-color: #4caf50;
            transition: var(--main-transition);
            `
            submit_btn.textContent = data.message;
            name_input.value = "";
            phone_input.value = "";
            age_input.value = "";
            gender.value = "";
            day.value = "";
            date_input.value = "";
            type_input.value = "";
            payment_method.value= "";
            national_id_input.value = "";
        }else{
            location.href = data.link;
        }
    })
    .catch(error => console.log(error)); 
   }
});

national_id_input.addEventListener("change" ,_ => {
    let national_id_value = national_id_input.value;
    let discount_data = new FormData();
    discount_data.append("national_id",national_id_value);
    discount_data.append("doctor_id" ,doctor_id);
    fetch("http://127.0.0.1:8000/api/hasDiscount" , {
        method:"Post",
        body : discount_data
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Cant Fetch api");
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        if(data.status = "found"){
            let discount  = document.getElementById("discount");
            discount.style.cssText = `
                margin-bottom: 20px;
                background-color: var(--main-color);
                color: white;
                transition: var(--main-transition) linear;
                padding: 15px;`
            discount.textContent = `You have a discount and price Now is ${data.price}`; 

        }
    })
    .catch(error => console.log(error));
})
/*End Form */
