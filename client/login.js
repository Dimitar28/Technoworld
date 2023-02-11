const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const signUpForm = document.querySelector(".sign-up-form")
const signInForm = document.querySelector(".sign-in-form");
const passwordInputs = document.querySelectorAll("input[type=password]")
const viewPassButtons = document.querySelectorAll(".view-pass");
const container = document.querySelector(".container");
const user = JSON.parse(localStorage.getItem("user"))

//Sign up form
signUpForm.addEventListener("submit", e => {
  e.preventDefault();
  const signUpUserName = document.querySelector("#sign-up-username").value;
  const signUpPassword = document.querySelector("#sign-up-password").value;
  createUser(signUpUserName, signUpPassword)
})
function createUser(userName, password) {
  //Hash password before saving to local storage
  const signUpUser = {
    signUpUserName: userName,
    signUpPassword: password
  }
  if (userName === '' || password === '') return alert("Enter your information");
  localStorage.setItem("user", JSON.stringify(signUpUser))
  window.location.href = "login.html"
}
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});
//Sign in form
signInForm.addEventListener("submit", e => {
  e.preventDefault();
  const signInUserName = document.querySelector("#sign-in-username").value;
  const signInPassword = document.querySelector("#sign-in-password").value
  authUser(signInUserName, signInPassword)
})
function authUser(userName, password) {
  if (userName === "" && password === "") return alert("Enter username and password");
  if (userName !== user.signUpUserName && password !== user.signUpPassword) return alert("Incorrect username and password");
  if (userName !== user.signUpUserName) return alert("Incorrect username");
  if (password !== user.signUpPassword) return alert("Incorrect password");
  else {
    window.location.href = "index.html";
  }
}
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
//password view
viewPassButtons.forEach(viewPassButton => {
  viewPassButton.addEventListener("click", () => {
    togglePasswordVisibility(viewPassButton);
  })
})
function togglePasswordVisibility(button) {
  passwordInputs.forEach(passwordInput => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      button.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
      passwordInput.type = "password";
      button.innerHTML = '<i class="fa fa-eye"></i>';
    }
  })
}