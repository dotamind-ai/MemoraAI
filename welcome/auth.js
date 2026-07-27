// ================================
// MEMORA SIMPLE AUTH
// ================================


let loginBtn = document.getElementById("loginBtn");

let registerBtn = document.getElementById("registerBtn");

let authWindow = document.getElementById("authWindow");

let authTitle = document.getElementById("authTitle");

let submitAuth = document.getElementById("submitAuth");


let username =
document.getElementById("username");


let password =
document.getElementById("password");



let mode = "login";





// открыть вход

loginBtn.onclick = function(){

    mode="login";

    authTitle.innerHTML="Войти";

    submitAuth.innerHTML="Войти";

    authWindow.classList.add("show");

};






// открыть регистрацию

registerBtn.onclick = function(){

    mode="register";

    authTitle.innerHTML="Создать аккаунт";

    submitAuth.innerHTML="Создать";

    authWindow.classList.add("show");

};








// кнопка продолжить

submitAuth.onclick=function(){



let login=username.value.trim();

let pass=password.value.trim();



if(login==="" || pass===""){

alert("Заполни логин и пароль");

return;

}







// РЕГИСТРАЦИЯ


if(mode==="register"){



let user={

login:login,

password:pass

};



localStorage.setItem(

"memoraUser",

JSON.stringify(user)

);



alert("Аккаунт создан");



authWindow.classList.remove("show");



username.value="";

password.value="";



return;


}








// ВХОД


if(mode==="login"){



let savedUser =

JSON.parse(

localStorage.getItem("memoraUser")

);




if(!savedUser){


alert("Сначала создай аккаунт");


return;


}




if(

savedUser.login===login &&

savedUser.password===pass

){


localStorage.setItem(

"memoraAuth",

"true"

);




// переход в приложение

window.location.href=

"app/index.html";



}

else{


alert("Неверный логин или пароль");


}



}




};