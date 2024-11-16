
import Home from "../src/pages/home/home.jsx";
import Dashboard from "./pages/dashboard/dashboard";
import { Route , Routes} from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
    </div>
  );
}

export default App;
