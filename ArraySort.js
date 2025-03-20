// DOM elements
const elementInput = document.getElementById('elementInput');
const addButton = document.getElementById('addButton');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const elementsContainer = document.getElementById('elementsContainer');
const clearAllContainer = document.getElementById('clearAllContainer');
const clearAllButton = document.getElementById('clearAllButton');
const sortButton = document.getElementById('sortButton');
const sortResults = document.getElementById('sortResults');
const placeholder = document.getElementById('placeholder');
const sortedElementsContainer = document.getElementById('sortedElementsContainer');
const ascendingRadio = document.getElementById('ascending');
const descendingRadio = document.getElementById('descending');

// Set current date
const date = new Date();
const formattedDate = date.toLocaleDateString('en-US', { 
  month: 'long', 
  day: 'numeric', 
  year: 'numeric' 
});
document.getElementById('current-date').textContent = formattedDate;

// State
let elements = [];
let sortedElements = [];

// Event listeners
addButton.addEventListener('click', handleAddElement);
elementInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleAddElement();
  }
});
clearAllButton.addEventListener('click', clearAllElements);
sortButton.addEventListener('click', sortElements);

// Functions
function handleAddElement() {
  const inputValue = elementInput.value.trim();
  
  if (!inputValue) {
    showError('Please enter a value');
    return;
  }

  const newElements = inputValue
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  if (newElements.length === 0) {
    showError('Please enter valid values');
    return;
  }

  elements = [...elements, ...newElements];
  elementInput.value = '';
  hideError();
  renderElements();
  updateClearAllButton();
}

function showError(message) {
  errorMessage.textContent = message;
  errorAlert.style.display = 'flex';
}

function hideError() {
  errorAlert.style.display = 'none';
}

function updateClearAllButton() {
  if (elements.length > 0) {
    clearAllContainer.style.display = 'flex';
  } else {
    clearAllContainer.style.display = 'none';
  }
}

function clearAllElements() {
  elements = [];
  renderElements();
  updateClearAllButton();
  
  // Also clear sorted results
  sortedElements = [];
  renderSortedElements();
}

function renderElements() {
  elementsContainer.innerHTML = '';
  
  elements.forEach((element, index) => {
    const elementDiv = document.createElement('div');
    elementDiv.className = 'element';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = element;
    
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-btn';
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => handleRemoveElement(index));
    
    elementDiv.appendChild(textSpan);
    elementDiv.appendChild(removeButton);
    elementsContainer.appendChild(elementDiv);
  });
}

function handleRemoveElement(index) {
  elements.splice(index, 1);
  renderElements();
  updateClearAllButton();
}

function sortElements() {
  console.log('call sortElement');
  if (elements.length === 0) {
    showError('Please add elements to sort');
    return;
  }

  hideError();

  // Create a copy of the elements array
  const elementsCopy = [...elements];
  const sortOrder = ascendingRadio.checked ? 'ascending' : 'descending';

  // Sort the elements
  elementsCopy.sort((a, b) => {
    // Check if both elements are numbers
    const numA = Number(a);
    const numB = Number(b);

    if (!isNaN(numA) && !isNaN(numB)) {
      console.log(`first: ${numA}`);
      console.log(`second: ${numB}`);
      return sortOrder === 'ascending' ? numA - numB : numB - numA;
    }

    // If not both numbers, sort as strings
    return sortOrder === 'ascending'
      ? a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
      : b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
  });

  sortedElements = elementsCopy;
  renderSortedElements();

  // Trigger animation
  sortResults.classList.add('animating');
  setTimeout(() => sortResults.classList.remove('animating'), 500);
}

function renderSortedElements() {
  if (sortedElements.length === 0) {
    placeholder.style.display = 'block';
    sortedElementsContainer.style.display = 'none';
    return;
  }

  placeholder.style.display = 'none';
  sortedElementsContainer.style.display = 'flex';
  sortedElementsContainer.innerHTML = '';
  
  sortedElements.forEach((element) => {
    const elementDiv = document.createElement('div');
    elementDiv.className = 'sorted-element';
    elementDiv.textContent = element;
    sortedElementsContainer.appendChild(elementDiv);
  });
}