import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Game } from './components/Game';

import './App.css';
import { useSocket } from './hooks/useSocket';



function App() {
  const data = useSocket()
  return (
    <Routes>
      <Route path='/' element={<Home data={data} />} />
      <Route path='/:gameId' element={<Game />} />
    </Routes>
  );
}

export default App;
