import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import App from './App.tsx';
import ReactDOM from 'react-dom/client';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({ window });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HistoryRouter history={history} basename="/showroom">
    <Routes>
      <Route index element={<App />} />
    </Routes>
  </HistoryRouter>
);
