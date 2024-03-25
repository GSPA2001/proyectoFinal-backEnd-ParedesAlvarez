const socket = io();

const form = document.getElementById("form");
const productsTable = document.querySelector("#productsTable");
const tbody = productsTable.querySelector("#tbody");

const title = document.querySelector("#title");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const thumbnail = document.querySelector("#thumbnail");
const code = document.querySelector("#code");
const category = document.querySelector("#category");
const stock = document.querySelector("#stock");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let product = {
    title: title.value,
    description: description.value,
    price: price.value,
    thumbnail: thumbnail.value,
    code: code.value,
    category: category.value,
    stock: stock.value,
  };

  const res = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const result = await res.json();
    if (result.status === "error") {
      throw new Error(result.error);
    } else {
      const resultProducts = await fetch("/api/products");
      const results = await resultProducts.json();

      if (results.status === "error") {
        throw new Error(results.error);
      } else {
        socket.emit("productList", results.allProducts);

        Toastify({
          text: "Nuevo producto agregado exitosamente",
          duration: 4000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#b1ffa4d1",
            borderRadius: "10px",
            fontWeight: "600",
          },
          onClick: function () {}, // Callback after click
        }).showToast();

        title.value = "";
        description.value = "";
        price.value = "";
        thumbnail.value = "";
        code.value = "";
        category.value = "";
        stock.value = "";
      }
    }
  } catch (err) {
    console.log(err);
  }
});

const deleteProduct = async (id) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();

    if (result.status === "error") {
      throw new Error(result.error);
    } else {
      socket.emit("productList", result.products);
    }

    Toastify({
      text: "Producto eliminado exitosamente",
      duration: 2250,
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ff5c5cc1",
        borderRadius: "10px",
        fontWeight: "600",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } catch (error) {
    console.error("Error en deleteProduct:", error);
  }
};

socket.on("updatedProducts", (products) => {
  tbody.innerHTML = "";

  products.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>${item.price}</td>
                <td>${item.thumbnail}</td>
                <td>${item.code}</td>
                <td>${item.category}</td>
                <td>${item.stock}</td>
                <td>
                    <button class='btn btn-danger text-white' onclick="deleteProduct('${item._id}')" id='btnDelete'>Eliminar</button>
                </td>

            `;
    tbody.appendChild(tr);
  });
});
