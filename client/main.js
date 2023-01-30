const buttons = document.querySelectorAll(".add-to-cart");
const shoppingList = document.querySelector(".shopping-list");
const mainPage = document.querySelector("main");
const shoppingPage = document.querySelector(".shopping-page");
const productContainer = document.querySelector(".featured-components");
let products = document.querySelectorAll(".card");

const shoppingItems = [];
const storedShoppingItems = JSON.parse(localStorage.getItem("shoppingItems"));

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
    addToCart(e.target);
  });
});
function addToCart(button) {
  shoppingList.style.display = "flex";
  const itemName = button.parentElement.querySelector(".card-name").textContent;
  const itemImage = button.parentElement.querySelector(".card-image").src;
  const itemPrice = button.parentElement.querySelector(".price").textContent;
  const item = { name: itemName, image: itemImage, price: itemPrice }; // Create an object representing the item
  shoppingItems.push(item); // Add the element to the array of shopping items
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));

  createElement(item);
}
function createElement(item) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("shopping-item", "text-center");
  itemElement.innerHTML = `
    <div class="card ">
    <a href="index.html" class="card-link">
    <img src="${item.image}" class="card-image" alt="${item.name}">
    <h3 class="card-name">${item.name}</h3>
    <p class="price-tag">Price:<span class="price">${item.price}</span></p>
    </a>
    <button class="remove-button"><i class="fa fa-trash-o"></i> Remove Item</button>
    </div>
  `;
  shoppingList.appendChild(itemElement);
  RemoveItems(itemElement);
  updateCartCount();
}
function RemoveItems(element) {
  const removeButton = element.querySelector(".remove-button");
  removeButton.addEventListener("click", () => {
    const index = shoppingItems.indexOf(element); //getting the index of the selected element
    shoppingItems.splice(index, 1); //removing the element from the array
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
}
function CheckOutItems() {
  const checkoutButton = document.querySelector(".checkout-button");
  checkoutButton.addEventListener("click", () => {
    let totalPrice = 0;
    for (let i = 0; i < shoppingItems.length; i++) {
      totalPrice += parseFloat(shoppingItems[i].price);
    }
    shoppingItems.length === 0
      ? alert("Your shopping cart is empty!")
      : alert(`Thank you for your purchase! Your total is ${totalPrice}$`);
    shoppingList.innerHTML = "";
    shoppingItems.length = 0;
    localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
    updateCartCount();
    shoppingList.style.display = "none";
  });
}
CheckOutItems();

const backButton = document.querySelector(".back-button");
backButton.addEventListener("click", (e) => {
  backToMainPage();
});
function backToMainPage() {
  shoppingPage.style.display = "none";
  mainPage.style.display = "grid";
}

const dropdownLinks = document.querySelectorAll(".dropdown > button");
dropdownLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // Toggle the dropdown content
    const dropdownContent = e.target.nextElementSibling;
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });
});
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
  localStorage.setItem("message", notification.style.display);
});
//filter/sort form
let originalProducts;

const form1 = document.querySelector("#filter-form");
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  filterAndSortProducts();
});
function filterAndSortProducts() {
  // Get the selected category and sorting options
  const category = document.querySelector("#category").value;
  const sort = document.querySelector("#sort").value;
  originalProducts === undefined
    ? (originalProducts = Array.from(products))
    : (products = Array.from(originalProducts));
  products = Array.from(originalProducts);
  // Filter the products based on the selected category
  let filteredProducts = products;
  if (category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.dataset.category === category
    );
  }
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
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keyup", handleSearch);
function handleSearch(e) {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredProducts = Array.from(products).filter((product) => {
    return product
      .querySelector(".card-name")
      .textContent.toLowerCase()
      .includes(searchQuery);
  });
  //enter keycode
  if (e.key === "Enter" || e.key === "Backspace") {
    displayProducts(filteredProducts);
  }
}
function displayProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    productContainer.appendChild(product);
  });
}
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
    if (emailInput.value === "") alert("Enter a valid email adress");
    else alert("Congratulations! You have subscribed to our newsletter");
    emailForm.reset();
  },
  {
    once: true,
  }
);
//getting the current year for the copyright text
const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();
