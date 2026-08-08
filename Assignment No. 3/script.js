let highest = 0;
let topperName = "";
function calculate(){
    let name = document.getElementsById("name").value;
    let physics = Number(document.getElementById("Physics").value);
    let chemistry = Number(document.getElementById("Chemistry").value);
    let math = Number(document.getElementById("Maths").value);
    let total = physics + chemistry + math;
    let percentage = total / 3;
    document.getElementById("total").value = total;
    document.getElementById("percentage").value = percentage.toFixed(2) + "%";
    let row = document.getElementById("StudentTable").insertRow();
    row.insertCell(0).innerHTML = StudentName;
    row.insertCell(1).innerHTML = TotalMarks;
    row.insertCell(2).innerHTML = percentage.toFixed(2) + "%";
    if(percentage > highest){
        highest = percentage;
        topperName = StudentName;
    }
    document.getElementById("topper").innerHTML = "Topper: " + topperName + "("+ highest.toFixed(2) + "%)";
} 