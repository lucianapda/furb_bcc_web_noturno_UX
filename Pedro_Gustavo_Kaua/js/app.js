const slider = document.getElementById("cardsSlider");
const cards = document.querySelectorAll(".description-cards");
const arrowLeft = document.querySelector(".icon-left");
const arrowRight = document.querySelector(".icon-right");

let currentSlide = 0;

function updateSlider() {
  const cardWidth = cards[0].offsetWidth + 20;
  slider.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

  cards.forEach((card, index) => {
    card.classList.remove("active", "side");

    arrowLeft.style.display = currentSlide === 0 ? "none" : "flex";

    if (currentSlide == cards.length - 1) {
      arrowRight.style.display = "none";
    } else {
      arrowRight.style.display = "flex";
    }

    if (index === currentSlide) {
      card.classList.add("active");
    } else {
      card.classList.add("side");
    }
  });
}

function sliderScrollRight() {
  if (currentSlide < cards.length - 1) {
    currentSlide++;
    updateSlider();
  }
}


function irParaCard(id) {
  console.log("irParaCard chamado com id:", id);
  console.log("total de cards:", cards.length);

  for (var i = 0; i < cards.length; i++) {
    console.log("card", i, "data-id:", cards[i].getAttribute("data-id"));
    if (cards[i].getAttribute("data-id") === id) {
      console.log("encontrou no índice", i);
      currentSlide = i;
      updateSlider();
      document.querySelector(".adopt-description").scrollIntoView({ behavior: "smooth" });
      return;
    }
  }
  console.log("não encontrou nenhum card com id:", id);
}


function sliderScrollLeft() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
}

updateSlider();
