import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";
import Game from "./pages/game/Game.jsx";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:name" element={<Detail />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
