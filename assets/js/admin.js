console.log("ADMIN JS LOADED");

const form = document.getElementById("admin-form");
const listDiv = document.getElementById("admin-list");

// GET data
function getProperties() {
    return JSON.parse(localStorage.getItem("properties")) || [];
}

// SAVE data
function saveProperties(data) {
    localStorage.setItem("properties", JSON.stringify(data));
}

// ADD PROPERTY
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProperty = {
        id: Date.now(),
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        location: document.getElementById("location").value,
        image: document.getElementById("image").value
    };

    const properties = getProperties();
    properties.push(newProperty);
    saveProperties(properties);

    form.reset(); // clear form
    renderAdmin();
});

// DELETE PROPERTY
function deleteProperty(id) {
    let properties = getProperties();
    properties = properties.filter(p => p.id !== id);
    saveProperties(properties);
    renderAdmin();
}

// RENDER LIST
function renderAdmin() {
    const properties = getProperties();
    listDiv.innerHTML = "";

    if (properties.length === 0) {
        listDiv.innerHTML = "<p>No properties added yet</p>";
        return;
    }

    properties.forEach(p => {
        listDiv.innerHTML += `
            <div style="margin-bottom: 10px; padding:10px; border:1px solid #ccc;">
                <b>${p.title}</b> - ${p.location} - ${p.price}
                <br>
                <button onclick="deleteProperty(${p.id})">Delete</button>
            </div>
        `;
    });
}

// INITIAL LOAD
renderAdmin();