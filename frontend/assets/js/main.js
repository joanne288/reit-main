/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('header')
    if (this.scrollY >= 50) {
        header.classList.add('scroll-header')
    }
}
window.addEventListener('scroll', scrollHeader)


/*=============== DYNAMIC PROPERTIES & SWIPER ===============*/

const properties = [
    {
        id: 1,
        title: "Koregaon Park Bungalow",
        price: "₹1.8 Cr",
        image: "assets/img/popular1.jpg",
        location: "Pune",
        type: "bungalow"
    },
    {
        id: 2,
        title: "Pedar Road Cottage",
        price: "₹2.4 Cr",
        image: "assets/img/popular2.jpg",
        location: "Mumbai",
        type: "bungalow"
    },
    {
        id: 3,
        title: "Colva Holiday Home",
        price: "₹1.2 Cr",
        image: "assets/img/popular3.jpg",
        location: "Goa",
        type: "bungalow"
    },
    {
        id: 4,
        title: "Garden Nest",
        price: "₹1.69 Cr",
        image: "assets/img/popular4.jpg",
        location: "Bangalore",
        type: "villa"
    },
    {
        id: 5,
        title: "Palmgrove Villa",
        price: "₹1.9 Cr",
        image: "assets/img/popular5.jpg",
        location: "Delhi",
        type: "villa"
    }
];

/*=============== RENDER FUNCTION ===============*/
function renderProperties(list) {
    const propertyList = document.getElementById("property-list");

    if (!propertyList) return;

    propertyList.innerHTML = "";

    list.forEach(property => {
        const card = `
        <div class="swiper-slide">
            <article class="popular__card">
                <img class="popular__img" src="${property.image}" alt="">
                <div class="popular__data">
                    <h2 class="popular__price">${property.price}</h2>
                    <h3 class="popular__title">${property.title}</h3>
                    <p class="popular__description">${property.location}</p>
                    <a href="property.html?id=${property.id}" class="button">View Details</a>
                </div>
            </article>
        </div>
        `;
        propertyList.innerHTML += card;
    });

    // destroy old swiper
    if (window.mySwiper) {
        window.mySwiper.destroy(true, true);
    }

    // init swiper
    window.mySwiper = new Swiper(".popular__container", {
        spaceBetween: 32,
        grabCursor: true,
        centeredSlides: false,  
        slidesPerView: 3,        
        loop: list.length > 3,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}
/*=============== INITIAL RENDER ===============*/
renderProperties(properties);
/*=============== SEARCH ===============*/

const searchForm = document.getElementById("search-form");
const searchInput = document.querySelector(".home__search-input");

if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const query = searchInput.value.toLowerCase();

        const filtered = properties.filter(property =>
            property.location.toLowerCase().includes(query) ||
            property.title.toLowerCase().includes(query)
        );

        renderProperties(filtered);

        // Scroll to popular section smoothly
        document.getElementById("popular").scrollIntoView({ behavior: "smooth" });
    });
}
/*=============== VALUE ACCORDION ===============*/
const toggleItem = (item) => {
    const accordionContent = item.querySelector('.value__accordion-content')

    if (item.classList.contains('accordion-open')) {
        accordionContent.removeAttribute('style')
        item.classList.remove('accordion-open')
    } else {
        accordionContent.style.height = accordionContent.scrollHeight + 'px'
        item.classList.add('accordion-open');
    }
}

const accordionItems = document.querySelectorAll('.value__accordion-item')
accordionItems.forEach((item) => {
    const accordionHeader = item.querySelector('.value__accordion-header');
    accordionHeader.addEventListener('click', () => {
        const openItem = document.querySelector('.accordion-open')
        toggleItem(item)

        if (openItem && openItem !==item) {
            toggleItem(openItem);
        }
    });
});
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link'); // Change 'add' to 'remove'
        }
    });
}

window.addEventListener('scroll', scrollActive);

/*=============== SHOW SCROLL UP ===============*/
function scrollUP() {
    const scrollUp = document.getElementById('scroll-up');

    if (window.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', scrollUP);

const scrollUpButton = document.getElementById('scroll-up');
scrollUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


/*=============== DARK LIGHT THEME ===============*/

const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'bx-sun';

const toggleTheme = () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    localStorage.setItem('selected-theme', document.body.classList.contains(darkTheme) ? 'dark' : 'light');
    localStorage.setItem('selected-icon', themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun');
};

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', toggleTheme);
