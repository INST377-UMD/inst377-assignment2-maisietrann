document.addEventListener("DOMContentLoaded", () => {
  const apiURL = "https://zenquotes.io/api/quotes/";

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      //  random quote 
      const randomIndex = Math.floor(Math.random() * data.length);
      const quote = data[randomIndex].q;
      const author = data[randomIndex].a;
      document.getElementById("quote").textContent = `"${quote}" — ${author}`;
    })
    .catch(err => {
      console.error("Quote fetch error:", err);
      document.getElementById("quote").textContent = "Failed to load quote.";
    });
});

  
    //  Voice commands 
    if (annyang) {
      const commands = {
        "hello": () => alert("Hello World"),
        "change the color to *color": (color) => {
          document.body.style.backgroundColor = color;
        },
        "navigate to *page": (page) => {
          page = page.toLowerCase();
          if (page.includes("home")) location.href = "index.html";
          else if (page.includes("stock")) location.href = "stocks.html";
          else if (page.includes("dog")) location.href = "dogs.html";
        }
      };
      annyang.addCommands(commands);
    }
  ;
  
  function startVoice() {
    if (annyang) annyang.start();
  }
  
  function stopVoice() {
    if (annyang) annyang.abort();
  }
  