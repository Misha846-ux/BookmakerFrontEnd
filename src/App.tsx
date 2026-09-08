import { BrowserRouter } from "react-router-dom";
import General from "./RouterComponents/General";
import "./Main.css"

function App() {
  return (
    <BrowserRouter>
      <General />
    </BrowserRouter>
  )
}

export default App;