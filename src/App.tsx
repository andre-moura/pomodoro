import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <div>
      <Navbar/>
      <Home/>
    </div>
  );
};

export default App;
