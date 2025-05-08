
const API_KEY = "EPfkRTXPMtElvf15L11V9CgJIowK4m4s"; 

let stockChart;

function fetchStock() {
  const ticker = document.getElementById("tickerInput").value.toUpperCase();
  const days = document.getElementById("rangeSelect").value;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - Number(days));

  const from = startDate.toISOString().split("T")[0];
  const to = endDate.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results) {
        alert(" Please try a different ticker.");
        return;
      }

      const labels = data.results.map(item => {
        const date = new Date(item.t);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      const prices = data.results.map(item => item.c);
      renderChart(ticker, labels, prices);
    })
    .catch(err => {
      console.error("Polygon fetch error:", err);
      alert("Failed to load stock data.");
    });
}

function renderChart(ticker, labels, data) {
  const ctx = document.getElementById("stockChart").getContext("2d");

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `${ticker} Closing Prices`,
        data: data,
        borderColor: "#5B42F3",
        backgroundColor: "rgba(91, 66, 243, 0.1)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

function loadRedditStocks() {
  fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03")
    .then(res => res.json())
    .then(data => {
      const tableBody = document.querySelector("#redditStocks tbody");
      const topFive = data.slice(0, 5);

      topFive.forEach(stock => {
        const row = document.createElement("tr");

        const tickerCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        link.target = "_blank";
        link.textContent = stock.ticker;
        tickerCell.appendChild(link);

        const commentsCell = document.createElement("td");
        commentsCell.textContent = stock.no_of_comments;

        const sentimentCell = document.createElement("td");
        const icon = document.createElement("img");
        icon.src = stock.sentiment === "Bullish"
          ? "https://cdn-icons-png.flaticon.com/512/6978/6978349.png"
          : "https://cdn-icons-png.freepik.com/512/6410/6410304.png";
        icon.alt = stock.sentiment;
        icon.width = 60;
        sentimentCell.appendChild(icon);

        row.appendChild(tickerCell);
        row.appendChild(commentsCell);
        row.appendChild(sentimentCell);
        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Reddit stock fetch failed:", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadRedditStocks();

  if (annyang) {
    const commands = {
      "hello": () => alert("Hello World"),
      "change the color to *color": (color) => {
        document.body.style.backgroundColor = color;
      },
      "navigate to *page": (page) => {
        const path = page.toLowerCase();
        if (path.includes("home")) location.href = "index.html";
        else if (path.includes("dogs")) location.href = "dogs.html";
        else if (path.includes("stocks")) location.href = "stocks.html";
      },
      "lookup *ticker": (ticker) => {
        document.getElementById("tickerInput").value = ticker.toUpperCase();
        document.getElementById("rangeSelect").value = "30";
        fetchStock();
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
