import { Routes, Route, } from "react-router-dom";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";

function App() {
    return (
      <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    );
}

export default App;
