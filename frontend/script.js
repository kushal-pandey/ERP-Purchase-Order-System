const API_URL = "http://127.0.0.1:8000";

let googleInitialized = false;

async function loadVendors() {
  let res = await fetch(`${API_URL}/vendors/`);
  let data = await res.json();

  let select = document.getElementById("vendorSelect");

  data.forEach((vendor) => {
    let option = document.createElement("option");
    option.value = vendor.id;
    option.text = vendor.name;
    select.appendChild(option);
  });
}

let productsList = [];

async function loadProducts() {
  let res = await fetch(`${API_URL}/products/`);
  productsList = await res.json();
}

function addRow() {
  console.log("addRow triggered");

  if (productsList.length === 0) {
    alert("Products not loaded yet");
    return;
  }

  let table = document.getElementById("productTable");
  let row = table.insertRow();

  // Create dropdown
  let productDropdown = document.createElement("select");
  productDropdown.className = "productSelect form-select";

  productsList.forEach((p) => {
    let option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.name;
    option.dataset.price = p.unit_price;
    productDropdown.appendChild(option);
  });

  // Create qty input
  let qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.className = "qty form-control";
  qtyInput.value = 1;

  // Create price input
  let priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.className = "price form-control";
  priceInput.value = 0;

  // Delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "❌";
  deleteBtn.className = "btn btn-danger";

  // Event listeners
  productDropdown.addEventListener("change", function () {
    setPrice(this);
  });

  qtyInput.addEventListener("input", calculateTotal);
  priceInput.addEventListener("input", calculateTotal);

  deleteBtn.addEventListener("click", function () {
    deleteRow(this);
  });

  // Append cells
  row.insertCell(0).appendChild(productDropdown);
  row.insertCell(1).appendChild(qtyInput);
  row.insertCell(2).appendChild(priceInput);
  row.insertCell(3).appendChild(deleteBtn);

  // Initialize
  setPrice(productDropdown);
  calculateTotal();
}

function setPrice(select) {
  let price = select.options[select.selectedIndex].dataset.price;
  let row = select.closest("tr");
  row.querySelector(".price").value = price;

  calculateTotal();
}

function deleteRow(button) {
  let row = button.closest("tr");
  row.remove();

  calculateTotal();
}

function calculateTotal() {
  let rows = document.querySelectorAll("#productTable tr");
  let total = 0;

  rows.forEach((row, index) => {
    if (index === 0) return;

    let qty = row.querySelector(".qty").value;
    let price = row.querySelector(".price").value;

    total += qty * price;
  });

  total = total * 1.05;

  document.getElementById("totalAmount").innerText = total.toFixed(2);
}

async function submitPO() {
  let vendor_id = document.getElementById("vendorSelect").value;

  let rows = document.querySelectorAll("#productTable tr");
  let items = [];

  rows.forEach((row, index) => {
    if (index === 0) return;

    let product_id = row.querySelector(".productSelect").value;
    let quantity = row.querySelector(".qty").value;
    let price = row.querySelector(".price").value;

    items.push({
      product_id: parseInt(product_id),
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  });

  let body = {
    reference_no: "PO" + Math.floor(Math.random() * 1000),
    vendor_id: parseInt(vendor_id),
    items: items,
  };

  let res = await fetch(`${API_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let data = await res.json();

  let summary = document.getElementById("orderSummary");

  summary.classList.remove("d-none");
  summary.innerHTML = `
    <h5>✅ Order Created Successfully!</h5>
    <p><strong>Reference:</strong> ${body.reference_no}</p>
    <p><strong>Total:</strong> ₹ ${data.total}</p>
  `;
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadVendors();
  await loadProducts();

  document.getElementById("addProductBtn").addEventListener("click", addRow);

  document.getElementById("submitBtn").addEventListener("click", submitPO);

  initGoogle();

  // Ensure Google script is loaded before rendering button
  

  function initGoogle() {
    if (googleInitialized) return; // ✅ prevent multiple calls

    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id:
          "723020278925-lnhlq4d42tk90crhmiut7tbvgmbaa600.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
        },
      );

      googleInitialized = true; // ✅ mark as initialized
    } else {
      setTimeout(initGoogle, 500);
    }
  }
});

function handleCredentialResponse(response) {
  const token = response.credential;

  console.log("Google Token:", token);

  fetch("http://127.0.0.1:8000/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("JWT:", data);

      localStorage.setItem("jwt", data.access_token);

      alert("Login successful!");
    });
}
