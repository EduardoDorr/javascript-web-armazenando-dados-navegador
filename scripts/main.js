const form = document.getElementById("novoItem");
const list = document.getElementById("lista");
const listItems = getItemFromLocalStorage("items") || [];

window.onload = () => { fillListItems(); }

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let name = event.target.elements['nome'];
  let quantity = event.target.elements['quantidade'];
  let lastItem = listItems[listItems.length - 1];

  let item = {
    "name": name.value,
    "quantity": quantity.value,
    "id": lastItem ? (lastItem.id + 1) : 0 
  };

  clearForm(name, quantity);

  if (!checkForItemAndUpdate(item)) {
    createAndAddItemToList(item);
    addItemToListItems(item);
  }

  addListItemsToLocalStorage();
});

function createAndAddItemToList(item) {
  let newItem = createListElement(item);
  addItemToList(newItem);
}

function createListElement(item) {
  const newItem = document.createElement('li');
  newItem.classList.add("item");

  const itemQuantity = document.createElement("strong");
  itemQuantity.dataset.id = item.id;
  itemQuantity.innerHTML = item.quantity;

  newItem.appendChild(itemQuantity);
  newItem.innerHTML += item.name;
  newItem.appendChild(createButtonElement(item.id));

  return newItem;
}

function createButtonElement(id) {
  const button = document.createElement('button');
  button.innerText = "X";

  button.addEventListener("click", function() {
    deleteElement(this.parentNode, id);
  });

  return button;
}

function deleteElement(item, id) {
  let index = listItems.findIndex(listItem => listItem.id === id);
  listItems.splice(index, 1);
  item.remove();

  addListItemsToLocalStorage();
}

function addItemToList(item) {
  list.appendChild(item);
}

function fillListItems() {
  if (listItems === null)
    return;

  listItems.forEach(item => {
    createAndAddItemToList(item);
  });
}

function checkForItemAndUpdate(item) {
  let index = listItems.findIndex(listItem => listItem.name === item.name);

  if (index === -1)
    return false;

  listItems[index].quantity = item.quantity;
  let itemId = listItems[index].id;

  list.querySelector("[data-id='" + itemId + "']").innerHTML = item.quantity;

  return true;
}

function addItemToListItems(item) {
  listItems.push(item);
}

function addListItemsToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(listItems));
}

function getItemFromLocalStorage(key) {
  var item = localStorage.getItem(key);

  return JSON.parse(item);
}

function clearForm(name, quantity) {
  name.value = "";
  quantity.value = "";
}