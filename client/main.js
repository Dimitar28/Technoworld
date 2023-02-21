const buttons = document.querySelectorAll(".add-to-cart");
const shoppingList = document.querySelector(".shopping-list");
const mainPage = document.querySelector("main");
const shoppingPage = document.querySelector(".shopping-page");
const easterEggSection = document.querySelector(".easter-egg-section")
const productContainer = document.querySelector(".featured-components");
let products = document.querySelectorAll(".card");
const user = JSON.parse(localStorage.getItem("user"))
let shoppingItems = [];
const storedShoppingItems = JSON.parse(localStorage.getItem("shoppingItems"));
const stripe = Stripe("pk_test_51MWJzQBPlfaVkC5QNcfh131Z6aj0WrUpLfieMkKfAUgV2lvY76r3roo17cx29lX8UpqNEKLwhxlnW8opiX8YQuU200BOseCMVi");
//loader
const loading = document.querySelector(".loading");
window.addEventListener("DOMContentLoaded", () => {
  loading.style.display = "none";
});
//managing login/logout status
const loginLogoutLink = document.querySelector(".login-logout");
loginLogoutLink.addEventListener("click", () => {
  loginLogoutLink.innerHTML === '<i class="fa-regular fa-address-book"> </i> Log in' ? logIn(loginLogoutLink) : logOut(loginLogoutLink);
})
function logIn(link) {
  link.innerHTML = '<i class="fa-regular fa-address-book"> </i> Log out';
  link.href = "Login.html";
  localStorage.setItem("loginState", "Log Out");
}
function logOut(link) {
  link.innerHTML = '<i class="fa-regular fa-address-book"> </i> Log in';
  link.href = "/";
  localStorage.setItem("loginState", "Log In");
}
const loginState = localStorage.getItem("loginState");
if (loginState === "Log Out") loginLogoutLink.innerHTML = '<i class="fa-regular fa-address-book"> </i> Log out';

// Check if there are any stored shopping items
if (storedShoppingItems !== null) {
  // Add the stored items to the shopping list
  storedShoppingItems.forEach((item) => {
    createElement(item);
    shoppingItems.push(item);
  });
  updateCartCount();
}
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    addToCart(e.target); // adds the product to the cart
  });
});
function addToCart(button) {
  shoppingList.style.display = "flex";
  const itemName = button.parentElement.querySelector(".card-name").textContent;
  const itemImage = button.parentElement.querySelector(".card-image").src;
  const itemPrice = button.parentElement.querySelector(".price").textContent;
  const item = { name: itemName, image: itemImage, price: itemPrice }; // Create an object representing the item/product
  shoppingItems.push(item); // Add the item to the array of shopping items
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));

  createElement(item);
}
function createElement(item) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("shopping-item", "text-center");
  itemElement.innerHTML = `
    <div class="card show">
    <a href="index.html" class="card-link">
    <img src="${item.image}" class="card-image" alt="${item.name}">
    <h3 class="card-name">${item.name}</h3>
    <p class="price-tag">Price:$<span class="price">${item.price}</span></p>
    </a>
    <button class="remove-button"><i class="fa fa-trash"></i> Remove Item </button>
    </div>
  `;
  shoppingList.appendChild(itemElement); //appending the created element to the DOM
  RemoveItems(itemElement);
  updateCartCount();
}
function RemoveItems(element) {
  const removeButton = element.querySelector(".remove-button");
  removeButton.addEventListener("click", () => {
    const itemIndex = Array.from(shoppingList.children).indexOf(element); //converting the HTMLCollection returned by shoppingList.children into an array and getting the index of the selected element
    shoppingItems.splice(itemIndex, 1); //removing the element from the array
    element.remove(); // Remove the item from the shopping list
    localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
    updateCartCount();
  });
}
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  cartCount.textContent = shoppingItems.length;
}
const cartButton = document.querySelector(".cart-button");
cartButton.addEventListener("click", goToShoppingPage);
function goToShoppingPage() {
  shoppingPage.style.display = "block";
  mainPage.style.display = "none";
  easterEggSection.style.display = "none";
}
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.addEventListener("click", CheckOutItems);
async function CheckOutItems() {
  if (shoppingItems.length === 0 || !user) {
    shoppingItems.length === 0 ? alert("Your shopping cart is empty!") : alert("Log in with your account to purchase the selected items");
    return
  }

  loading.style.display = "grid"
  // Create an array of line items for the checkout session
  const lineItems = shoppingItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));
  // Create a checkout session on the server using Stripe API
  const response = await fetch("https://technoworld-atum.onrender.com/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lineItems }),
  });
  //reseting the shopping cart items
  shoppingItems.length = 0;
  shoppingList.innerHTML = "";
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
  shoppingList.style.display = "none";
  updateCartCount();

  // Redirect the user to the Stripe checkout page
  const data = await response.json();
  await stripe.redirectToCheckout({ sessionId: data.sessionId });
  window.addEventListener("popstate", () => {
    spinner.style.display = "none";
  });
}
const backButton = document.querySelector(".back-button");
backButton.addEventListener("click", (e) => {
  backToMainPage();
});
function backToMainPage() {
  shoppingPage.style.display = "none";
  mainPage.style.display = "grid";
  easterEggSection.style.display = "flex";
}
const removeAllButton = document.querySelector(".clear-button")
removeAllButton.addEventListener("click", () => {
  // Remove all items from the shopping cart
  shoppingList.innerHTML = "";
  shoppingItems = [];
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
  updateCartCount();
});
//dropdown working on mobile
const dropDownButton = document.querySelector(".dropdown");
const dropDownMenu = document.querySelector(".menu")
dropDownButton.addEventListener("touchstart", () => {
  dropDownMenu.style.visibility =
    dropDownMenu.style.visibility === "visible" ? "hidden" : "visible"
  dropDownMenu.style.opacity =
    dropDownMenu.style.opacity === "1" ? "0" : "1"
})
const progressBar = document.querySelector(".scroll-tracker");
window.addEventListener("scroll", () => {
  let totalHeight = document.body.scrollHeight - window.innerHeight; // Get the total scrollable height of the page
  let scrollPercentage = (window.pageYOffset / totalHeight) * 100; // Calculate the percentage of the page that has been scrolled
  progressBar.style.width = scrollPercentage + "%";
});
const notification = document.querySelector(".notification");
const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", () => {
  notification.style.display = "none";
});
//filter/sort form
let originalProducts;

const fliterForm = document.querySelector("#filter-form");
fliterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  filterAndSortProducts();
});
function filterAndSortProducts() {
  // Get the selected category and sorting options
  const category = document.querySelector("#category").value;
  const sort = document.querySelector("#sort").value;
  if (originalProducts === undefined) originalProducts = Array.from(products)
  else products = Array.from(originalProducts)
  // Filter the products based on the selected category
  let filteredProducts = Array.from(products)
  if (category !== "all") filteredProducts = filteredProducts.filter((product) => product.dataset.category === category);
  // Sort the products based on the selected option
  filteredProducts.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
      case "price-desc":
        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
    }
  });
  displayProducts(filteredProducts); // display the filtered and sorted products
}
//searching products
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", handleSearch);
function handleSearch() {
  const searchQuery = searchInput.value.toLowerCase();
  const searchedProducts = Array.from(products).filter((product) => {
    return product
      .querySelector(".card-name")
      .textContent.toLowerCase()
      .includes(searchQuery);
  });
  displayProducts(searchedProducts);
  const textNotFound = document.querySelector(".not-found")
  if (searchedProducts.length === 0) textNotFound.style.display = "block"
  else textNotFound.style.display = "none"
}
function displayProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    productContainer.appendChild(product);
  });
}

//animating the products
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("show", entry.isIntersecting);
      if (entry.isIntersecting) observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.3,
  }
);
products.forEach((product) => {
  observer.observe(product);
});

const backToTopButton = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTopButton.classList.toggle("active", window.scrollY > 700);
});
const searchBar = document.querySelector(".nav-search-input");
const toggleButton = document.querySelector(".toggle-search");
toggleButton.addEventListener("click", () => {
  searchBar.classList.toggle("visible");
});
const emailForm = document.querySelector(".email-form");
const emailInput = document.querySelector(".newsletter-input");
emailForm.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    if (emailInput.value === "") return alert("Enter your email adress");
    else alert("Congratulations! You have subscribed to our newsletter");
    emailForm.reset();
  },
);
//easter egg section
const easterEggForm = document.querySelector('.easter-egg-form');
easterEggForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = document.getElementById("inputValue").value;
  inputValue === "dino" ? window.location.href = "https://googledino28.netlify.app" : alert("Wrong input value")
})
const hints = ["For the second letter maybe you should check the feature section more carefully",
  "For the third letter maybe you should check the bottom of the site",
  "For the final letter maybe you should check the DevTools console.If you are on mobile,this hint won't work but we are sure you can guess the word"];
const usedHints = [];
const hintContainer = document.getElementById("hintContainer")
const hintButton = document.getElementById("hintButton")
hintButton.addEventListener("click", () => {
  hints.length != 0 ? handleHints() : alert("No more hints available");
  function handleHints() {
    const index = Math.floor(Math.random() * hints.length);
    const hint = hints[index];
    usedHints.push(hint);
    hints.splice(index, 1);
    hintContainer.innerHTML = hint + "<i class='fa fa-close'> </i>";
    const closeHintButton = document.querySelector('.fa-close');
    closeHintButton.addEventListener('click', () => {
      hintContainer.innerHTML = ""
    })
  }
});
console.log("Why are you here.There is nothing to see: %co", "text-decoration: underline");
//getting the current year for the copyright text
const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();

//cursor animation
const trail = document.querySelector(".trail")
function animateTrail(e, interacting) {
  const x = e.clientX - trail.offsetWidth / 2;
  const y = e.clientY - trail.offsetHeight / 2
  const keyframes = {
    transform: trail.style.transform = `translate(${x}px, ${y}px) scale(${interacting ? 1.8 : 1})`
  }
  trail.animate(keyframes, {
    duration: 800,
    fill: "forwards"
  })
  trail.style.opacity = 1;
  setTimeout(() => {
    trail.style.opacity = 0;
  }, 1000);
}
document.addEventListener("mousemove", (e) => {
  const interactableCard = e.target.closest(".card");
  interacting = interactableCard !== null;
  animateTrail(e, interacting)
})
document.addEventListener('touchstart', () => {
  trail.style.display = 'none';
});