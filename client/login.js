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
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const signUpUser = {
    signUpUserName: userName,
    signUpPassword: password
  }
  if (userName === '' || password === '') return alert("Enter your information");
  if (password.length < 6) return alert("Password must contain at least 6 charachters")
  if (!hasCapital) return alert("Password must contain capitalized letters")
  if (!hasNumber) return alert("Password must contain numbers")
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
//generate random password
const generatePassButton = document.querySelector("#generate-btn");
const generatePassInput = document.querySelector("#generate-input")
generatePassButton.addEventListener("click", () => {
  const password = generatePassword(11);
  generatePassInput.value = password;
})
function generatePassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
//copy the random password to the clipboard
const copyBtn = document.getElementById("copy-btn");
const copyPassText = document.querySelector(".copy-pass-text")
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generatePassInput.value);
  } catch (err) {
    alert("Failed to copy password: ", err);
  }
  copyPassText.style.opacity = "1";
  copyPassText.style.visibility = "visible";
  setTimeout(() => {
    copyPassText.style.opacity = "0";
    copyPassText.style.visibility = "hidden";
  }, 2000)
})