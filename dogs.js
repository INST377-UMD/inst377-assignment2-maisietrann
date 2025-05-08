document.addEventListener("DOMContentLoaded", () => {
    loadCarouselImages();
    loadBreedButtons();
  
    if (annyang) {
      const commands = {
        "hello": () => alert("Hello World"),
        "navigate to *page": (page) => {
          page = page.toLowerCase();
          if (page.includes("home")) location.href = "index.html";
          if (page.includes("stocks")) location.href = "stocks.html";
          if (page.includes("dogs")) location.href = "dogs.html";
        },
        "load dog breed *breed": (breed) => {
          fetchBreedInfo(breed.toLowerCase());
        }
      };
      annyang.addCommands(commands);
    }
  });
  
  function startVoice() {
    if (annyang) annyang.start();
  }
  
  function stopVoice() {
    if (annyang) annyang.abort();
  }
  
  function loadCarouselImages() {
    fetch("https://dog.ceo/api/breeds/image/random/10")
      .then(res => res.json())
      .then(data => {
        const carousel = document.getElementById("carousel");
        carousel.innerHTML = "";
  
        data.message.forEach((url) => {
          const img = document.createElement("img");
          img.src = url;
          img.alt = "Dog";
          img.classList.add("carousel-img");
          carousel.appendChild(img);
        });
      });
  }
  
  function loadBreedButtons() {
    fetch("https://dogapi.dog/api/v2/breeds")
      .then(res => res.json())
      .then(data => {
  
        const shuffled = [...data.data].sort(() => 0.5 - Math.random());
        const breeds = shuffled.slice(0, 10);
  
        const container = document.getElementById("breed-buttons");
        container.innerHTML = "";
  
        breeds.forEach(breed => {
          const btn = document.createElement("button");
          const name = breed.attributes.name;
          btn.textContent = name;
          btn.className = "breed-button";
          btn.addEventListener("click", () => fetchBreedInfo(name));
          container.appendChild(btn);
        });
      });
  }
  
  
  
  
  
  function fetchBreedInfo(breedName) {
    fetch("https://dogapi.dog/api/v2/breeds")
      .then(res => res.json())
      .then(data => {
        const infoBox = document.getElementById("breed-info");
  
        const match = data.data.find(breed =>
          breed.attributes.name.toLowerCase().includes(breedName.toLowerCase())
        );
  
        if (!match) {
          infoBox.innerHTML = `<p><strong>No description found for "${breedName}".</strong></p>`;
          return;
        }
  
        const name = match.attributes.name;
        const description = match.attributes.description || "N/A";
        const minLife = match.attributes.life?.min ?? "N/A";
        const maxLife = match.attributes.life?.max ?? "N/A";
  
        infoBox.innerHTML = `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Min Life:</strong> ${minLife}</p>
          <p><strong>Max Life:</strong> ${maxLife}</p>
        `;
  
        infoBox.style.display = "block";
      })
      .catch(err => {
        console.error("Failed to fetch dog description:", err);
        document.getElementById("breed-info").innerHTML = "<p>Error loading breed info.</p>";
      });
  }
  