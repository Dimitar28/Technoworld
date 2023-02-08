const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const signUpFormButton = document.querySelector("#form-sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector(".sign-up-form")
const signInForm = document.querySelector(".sign-in-form");

const user = JSON.parse(localStorage.getItem("user"))
console.log(user)

//Sign up form
signUpForm.addEventListener("submit", e => {
  e.preventDefault();
  const signUpUserName = document.querySelector("#sign-up-username").value;
  const signUpPassword = document.querySelector("#sign-up-password").value;
  const signUpUser = {
    signUpUserName: signUpUserName,
    signUpPassword: signUpPassword
  }
  console.log(signUpUser);
  localStorage.setItem("user", JSON.stringify(signUpUser))
})
signUpFormButton.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:5173/login.html"
})
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});
//Sign in form
signInForm.addEventListener("submit", e => {
  e.preventDefault();
  const signInUserName = document.querySelector("#sign-in-username").value;
  const signInPassword = document.querySelector("#sign-in-password").value
  const signInUser = {
    signInUserName: signInUserName,
    signInPassword: signInPassword
  }
  if (signInUserName === "" && signInPassword === "") alert("Enter username and password")
  else if (signInUser.signInUserName !== user.signUpUserName && signInUser.signInPassword !== user.signUpPassword)
    alert("Incorrect username and password")
  else if (signInUser.signInUserName !== user.signUpUserName) alert("Incorrect username")
  else if (signInUser.signInPassword !== user.signUpPassword) alert("Incorrect password")
  else {
    window.location.href = "http://127.0.0.1:5173/index.html";

  }
})
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});