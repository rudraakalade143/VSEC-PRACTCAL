import { useState } from "react";
function App() {
  const [color, setColor] = useState("lightblue");
  function changeColor() {
    const colors = [
      "lightpink",
      "lightyellow",
      "lightgreen",
      "lavender",
      "lightblue",
      "peachpuff",
      "mistyrose",
      "paleturquoise"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }
  return (
    <div style={{ backgroundColor: color, height: "100vh", textAlign: "center" }}>
      <h1>Pastel Color Changer</h1>
      <h2>Current Color: {color}</h2>
      <button onClick={changeColor}>Change Color</button>
    </div>
  );
}
export default App;