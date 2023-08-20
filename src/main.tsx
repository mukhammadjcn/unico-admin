import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route index element={<App />} />
    </Routes>
  </Router>
);
