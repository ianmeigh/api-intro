const API_KEY = "";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

// Buttons

document.getElementById('status').addEventListener('click', (e) => getStatus(e));
document.getElementById('submit').addEventListener('click', (e) => postForm(e));

// API requests (GET and POST)

async function getStatus(e) {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();

  if (response.ok) {
    displayStatus(data);
  } else {
    displayException(data.error);
    throw new Error(data.error);
  }

}

async function postForm(e) {
  const checksForm = document.getElementById('checksform');
  const formData = new FormData(checksForm);

  formData.set('options', (formData.getAll('options').toString()));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": API_KEY
    },
    "body": formData
  });

  const data = await response.json();

  if (response.ok) {
    displayCheckErrors(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

// Display Data

function displayStatus(data) {
  let heading = "API Key Status";
  let results = "<div>Your key is valid until:</div>";
  results += `<div class="key-status">${data.expiry}</div>`;
  document.getElementById('resultsModalTitle').innerText = heading;
  document.getElementById('results-content').innerHTML = results;
  resultsModal.show();
}

function displayCheckErrors(data) {

  let results = "";

  let heading = `JSHint Results for ${data.file}`;
  if (data.total_errors === 0) {
    results = `<div class="no_errors">No errors reported!</div>`;
  } else {
    results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class="line">${error.line}</span>, `;
      results += `column <span class="column">${error.col}:</span></div>`;
      results += `<div class="error">${error.error}</div>`;
    }
  }

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModal.show();
}

function displayException(data) {
  console.log(data);
  let heading = "An Exception Occurred";
  results = `<div>The API returned status code ${data.status_code}</div>`;
  results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
  results += `<div>Error text: <strong>${data.error}</strong></div>`;
  document.getElementById('resultsModalTitle').innerText = heading;
  document.getElementById('results-content').innerHTML = results;
  resultsModal.show();
}

/* function displayCheckErrors(data) {

  const resultsContentElement = document.getElementById('results-content');
  resultsContentElement.innerHTML = "";

  // Look in to using createElement and DocumentFragment
  // https://www.javascripttutorial.net/javascript-dom/javascript-documentfragment/

  let heading = `JSHint results for ${data.file}`;
  let results = document.createElement('div');
  if (data.total_errors === 0) {

    results.setAttribute('class', 'no_errors');
    results.textContent = 'No errors reported';
  } else {
    results = document.createElement('div');
    results.textContent = 'Total Errors: ';

    let errorCount = document.createElement('span');
    errorCount.textContent = data.total_errors;

    results.appendChild(errorCount);

    for (let error of data.error_list) {
      
      let errorInfo = document.createElement('div');
      errorInfo.innerHTML = `At line <span class="line">${error.line}</span>,` +
        `column <span class="column">${error.col}</span>`;

      let errorMessage = document.createElement('div');
      errorMessage.setAttribute('class', 'error');
      errorMessage.textContent = error.error;

      errorInfo.appendChild(errorMessage);
      results.appendChild(errorInfo);
    }
  }

  document.getElementById('resultsModalTitle').innerText = heading;
  resultsContentElement.appendChild(results);
  resultsModal.show();
} */