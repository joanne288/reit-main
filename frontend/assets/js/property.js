const properties = [
    {
        id: 1,
        title: "Koregaon Park Bungalow",
        price: "₹1.8 Cr",
        image: "assets/img/popular1.jpg",
        location: "Pune",
        description: "Beautiful bungalow with modern amenities and spacious rooms."
    },
    {
        id: 2,
        title: "Pedar Road Cottage",
        price: "₹2.4 Cr",
        image: "assets/img/popular2.jpg",
        location: "Mumbai",
        description: "Luxury apartment in prime location with city view."
    },
    {
        id: 3,
        title: "Colva Holiday Home",
        price: "₹1.2 Cr",
        image: "assets/img/popular3.jpg",
        location: "Goa",
        description: "Peaceful beach house perfect for vacation living."
    },
    {
        id: 4,
        title: "Garden City Asset",
        price: "₹1.69 Cr",
        image: "assets/img/popular4.jpg",
        location: "Bangalore",
        description: "Modern home in tech hub with great connectivity."
    },
    {
        id: 5,
        title: "Garden City Asset 2",
        price: "₹1.9 Cr",
        image: "assets/img/popular5.jpg",
        location: "Delhi",
        description: "Spacious property in capital with premium facilities."
    }
];

// 📍 Get ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 📍 Find property
const property = properties.find(p => p.id == id);

// 📍 Display data
document.getElementById("title").innerText = property.title;
document.getElementById("price").innerText = property.price;
document.getElementById("location").innerText = property.location;
document.getElementById("description").innerText = property.description;
document.getElementById("image").src = property.image;

// 🔙 Back button
function goBack() {
    window.history.back();
}