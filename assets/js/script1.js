"use strict";

// theme toggle
(function () {
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  // apply saved preference before paint
  if (localStorage.getItem("portfolio-theme") === "light") {
    html.setAttribute("data-theme", "light");
  }

  toggle.addEventListener("click", function () {
    if (html.getAttribute("data-theme") === "light") {
      html.removeAttribute("data-theme");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("portfolio-theme", "light");
    }
  });
}());

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// skills modal
(function () {
  const skillsData = {
    technical: {
      title: "Technical Skills",
      tags: ["Python", "SQL", "JavaScript", "Java", "HTML / CSS", "Machine Learning", "A/B Testing", "Data Analysis & Visualization"],
      cert: false
    },
    tools: {
      title: "Tools & Platforms",
      tags: ["Tableau", "Power BI", "Streamlit", "Git", "Jira", "Jupyter Notebook", "Google Analytics", "AWS", "MySQL", "Google Colab", "Notion", "Slack"],
      cert: false
    },
    certifications: {
      title: "Certifications",
      tags: [
        "Professional Scrum Master (PSM 1) - Scrum.org",
        "Engineering Project Management - TAMU",
        "IIT Bombay Incubation & Entrepreneurship - Top 1%"
      ],
      cert: true
    }
  };

  const overlay = document.querySelector("[data-skills-overlay]");
  const modalTitle = document.querySelector("[data-skills-modal-title]");
  const modalBody = document.querySelector("[data-skills-modal-body]");
  const closeBtn = document.querySelector("[data-skills-modal-close]");

  function openModal(type) {
    const data = skillsData[type];
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.tags
      .map(tag => `<span class="skill-tag${data.cert ? " skill-tag--cert" : ""}">${tag}</span>`)
      .join("");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-skills-card]").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card.dataset.skillsCard);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
}());
