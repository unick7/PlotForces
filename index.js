function typeWrite(element) {
  const textoArray = element.innerHTML.split("");
  element.innerHTML = " ";
  textoArray.forEach(function (letter, i) {
    setTimeout(function () {
      element.innerHTML += letter;
    }, 75 * i);
  });
}
const text = document.querySelector(".Welcome-to");
typeWrite(text);

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
  fun();
}
function fun() {
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
