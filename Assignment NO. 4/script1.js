let q = [
    ["Capital of India?", "Mumbai", "New Delhi", "Delhi", "Kolkata", "New Delhi"],
    ["National animal?", "Lion", "Tiger", "Elephant", "Deer", "Tiger"],
    ["National bird?", "Crow", "Peacock", "Parrot", "Sparrow", "Peacock"],
    ["National flower?", "Rose", "Lotus", "Jasmine", "Sunflower", "Lotus"],
    ["Festival of Lights?", "Holi", "Eid", "Diwali", "Christmas", "Diwali"]
];
let i = 0, score = 0;
function start(){
    document.getElementById("name").style.display = "none";
    event.target.style.display = "none";
    document.getElementById("quiz").style.display = "block";
    show();
}
function show(){
    let x = q[i];
    document.getElementById("question").innerHTML = x[0];
    let html = "";
    for (let j = 1; j <= 4; j++)
         html += '<input type="radio" name="a" value="${x[j]}"> ${x[j]}<br>';
         document.getElementById("options").innerHTML = html;
} 
function next() {
    let a = document.querySelector('input[name="a"]:checked');

    if (!a) {
        alert("Select an answer");
        return;
    }

    if (a.value == q[i][5])
        score++;
    i++;

    if (i < q.length)
        show();
 else {
        document.getElementById("quiz").style.display = "none";
        document.getElementById("result").innerHTML = " " + document.getElementById("name").value +", your score is " + score + "/5";
    }
}