// global variables
var employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const modalLeft = document.querySelector(".modal-left");
const modalRight = document.querySelector(".modal-right");
var card;
var index;
var users = [];
var searchBar = document.querySelector(".form-field");
var btn = document.querySelector(".button-primary");
var searchValue;



fetch(urlAPI)
.then(res => res.json())
.then(res => res.results)
.then(displayEmployees)
.catch(err => console.log(err))

function displayEmployees(employeeData) {
    employees = employeeData;
    // store the employee HTML as we create it
    let employeeHTML = '';
    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;
    // template literals make this so much cleaner!
    employeeHTML += `
<div class="card" data-index="${index}">
<img class="avatar" src="${picture.large}" />
<div class="text-container">
<h2 class="name">${name.first} ${name.last}</h2>
<p class="email">${email}</p>
<p class="address">${city}</p>
</div>
</div>
`
users.push(name.first + " " + name.last);
});
gridContainer.innerHTML = employeeHTML;

}


function displayModal(index) {
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
<h2 class="name">${name.first} ${name.last}</h2>
<p class="email">${email}</p>
<p class="address">${city}</p>
<hr />
<p>${phone}</p>
<p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
<p>Birthday:
${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
</div>
`;
overlay.classList.remove("hidden");
modalContainer.innerHTML = modalHTML;
}

gridContainer.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element clicked
    card = e.target.closest(".card");
    index = Number(card.getAttribute('data-index'));
    displayModal(index);
    }
    });

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
    });

modalLeft.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    // select the card element based on its proximity to actual element clicked
    if(index === 0){
        index = 11;
    } else {
        index --;
    }
    displayModal(index);
    
    });
    
    
modalRight.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    // select the card element based on its proximity to actual element clicked
    if(index === 11){
        index = 0;
    } else {
        index ++;
    }
    displayModal(index);
    
    });




//search functionality

var field = document.querySelector(".autocomplete");

function autocomplete (inp , arr){
    var currentFocus;
    inp.addEventListener("input",function(e){
        var a, b, i, val = this.value;
        closeAllLists();
        if(!val){
            return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-items");
        a.setAttribute("class","autocomplete-items");
        this.parentNode.appendChild(a);
        for(i = 0 ; i<arr.length ; i++){
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
           b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("myInput"), users);
  
btn.addEventListener("click" , function(event) {
    searchValue = searchBar.value.toLowerCase();
    gridContainer.innerHTML = "";
    console.log(searchValue);
    console.log(employees)
    let employeeHTML = "";
    employees.forEach((employee, index) => {
        let fullName = employee.name.first.toLowerCase() + " " + employee.name.last.toLowerCase();
        if(fullName.startsWith(searchValue)){
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
        // template literals make this so much cleaner!
        employeeHTML += `
    <div class="card" data-index="${index}">
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    </div>
    </div>
    `

    console.log("success")
    console.log(employeeHTML)
    gridContainer.innerHTML = employeeHTML;
        }
    });
})