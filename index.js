function typeWriterEffect(element) {
  const letterArray = element.innerHTML.split("");
  element.innerHTML = " ";
  letterArray.forEach(function (letter, i) {
    setTimeout(function () {
      element.innerHTML += letter;
    }, 75 * i);
  });
}

// 'typeWrite' takes an HTML element as its argument.
// The function splits the text content of the element into an array of characters
// then sets the element's innerHTML to an empty string.
// The function then iterates through the array of characters,
// adding each character back to the element's innerHTML
// one at a time with a delay of 75 milliseconds between each character.

const welcomeText = document.getElementById("Welcome-to");
typeWriterEffect(welcomeText);

let search = document.getElementById("search");
const problems = new Map();
const counted = new Map();

search.addEventListener("click", (event) => {
  event.preventDefault();

  let sValue = document.getElementById("sValue");
  fetchProblemList(sValue.value);
  sValue.value = "";
});

async function fetchProblemList(arg) {
  let url = `https://codeforces.com/api/user.status?handle=${arg}`;
  const response = await fetch(url);
  if (response.status != 200) {
    window.alert("Please Enter a Valid Username");
    return 0;
  }

  const users = await response.json();
  console.log(users);
  const user_data = users.result;
  console.log(user_data);

  for (let rating = 800; rating <= 4000; rating += 100) {
    problems.set(rating, 0);
  }
  for (let user in user_data) {
    let level = user_data[user].problem.rating;
    let problem_name = user_data[user].problem.name;

    if (level === undefined) continue;
    if (problems.has(level) && user_data[user].verdict === "OK") {
      counted.set(problem_name, false);
    }
  }
  for (let user in user_data) {
    let level = user_data[user].problem.rating;
    let problem_name = user_data[user].problem.name;

    if (level === undefined) continue;
    if (
      problems.has(level) &&
      user_data[user].verdict === "OK" &&
      counted.get(problem_name) === false
    ) {
      let value = problems.get(level);
      problems.set(level, value + 1);
      counted.set(problem_name, true);
    }
  }
  plotGraph();
}

function plotGraph() {
  let keys = Array.from(problems.keys());
  let values = Array.from(problems.values());

  var xArray = keys;
  var yArray = values;

  TESTER = document.getElementById("tester");
  
  var data = [
    {
      x: xArray,
      y: yArray,
      mode: "lines",
      type: "scatter",
    },
  ];
  
  var layout = {
    xaxis: { range: [700, 3500], title: "Problems Difficulty" },
    yaxis: { range: [0, 300], title: "No. of Problems Solved" },
    title: "Plot",
  };
  
  Plotly.newPlot("tester", data, layout);
}
