const api = "https://fakestoreapi.com/products";

// HTML loader spinner
let loader = `<div class="loader"></div>`;

// DOM elements
const pageItems = document.getElementById("item-section");
const resultsCount = document.getElementById("count");
const sortItem = document.getElementById("sort-by-price");
const filterData = document.querySelectorAll(".ctg-checkbox");
const loadMore = document.getElementById("load-more");

// Product data variables
let ItemsList = []; // Fetched ItemsList from API
let filteredItems = [];
let dispItems = 0; // Items displayed at onload
const itemsPerPage = 10; // Items load per click

/**
 * Onload data from API
 */
const onLoadAPIData = ()=> {
    pageItems.innerHTML = loader;
    fetch(api).then(res =>{
      if (!res.ok) {
        pageItems.innerHTML = `<h2 style="position: relative;left: 100%;"> No Data Found </h2>`
        return;
      }
      return res.json();      
    })
    .then(data =>{
      if(data?.length>0 ){
      ItemsList = [...data];
      filteredItems = [...data];
      pageItems.innerHTML = "";
      itemInfoSection(filteredItems);
    }
    })
}

onLoadAPIData();

/**
 * Add Event to sort the Items by price.
 */
sortItem.addEventListener("change", (e) => {
  if (filteredItems.length > 0) {
    const selectedVal = sortItem.options[sortItem.selectedIndex].value;
    pageItems.innerHTML = "";
    const sortedProducts = filteredItems.sort((a, b) =>
      selectedVal === "LH" ? a.price - b.price : b.price - a.price
    );
    dispItems = 0;
    pageItems.innerHTML = "";
    itemInfoSection(sortedProducts);
  }
});

/**
 * Filter Items by category.
 */
function filterItemData() {
    const checkedCategories = [];
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].checked) {
        checkedCategories.push(filterData[i].value);
      }
    }
    const filteredProds = ItemsList.filter((item) => {
      if (checkedCategories.includes(item.category.toLowerCase())) {
        return item;
      }
    });
    const selectedItems = filteredProds.length > 0 ? filteredProds : ItemsList;
    filteredItems = [...selectedItems];

    dispItems = 0;
    pageItems.innerHTML = "";
    itemInfoSection(filteredItems);  
}

// filterItemData when category checkbox is clicked
for (let i = 0; i < filterData.length; i++) {
  filterData[i].addEventListener("click", filterItemData);
}

/**
 * Display items
 */
function itemInfoSection(items) {
  if (items.length > 0) {
    resultsCount.innerHTML = `<span>${items.length} Results</span>`;
    for (let i = dispItems; i < Math.min(dispItems + itemsPerPage, items.length); i++) {
      pageItems.insertAdjacentHTML(
        "beforeend",
        `        
            <div class="item">
                <div class="item-img">
                    <img src=${items[i].image} alt=${items[i].title} />
                </div>
                <div class="item-info">
                    <h3>${items[i].title}</h3>
                    <p>$${items[i].price}</p>
                </div>
            </div>
        `
      );
    }

    dispItems += itemsPerPage;

    // Show more item
    if (dispItems >= items.length) {
      loadMore.style.display = "none";
    } else {
      loadMore.style.display = "block";
    }
  } else {
    resultsCount.innerHTML = "";
    pageItems.innerHTML = `<h2 style="position: relative;left: 100%;"> No Data Found </h2>`;
  }
}

// Load more items click
loadMore.addEventListener("click", function () {
  itemInfoSection(filteredItems);
});


