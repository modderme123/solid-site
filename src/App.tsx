import { Suspense } from 'solid-js';
import { useRoutes, Router } from '@solidjs/router';
import { routes } from './routes';
import Header from './components/Header';
import { AppContextProvider } from './AppContext';
import { preventSmoothScrollOnTabbing } from './utils';

export const App = () => {
  const Routes = useRoutes(routes);

  preventSmoothScrollOnTabbing();

  return (
    <Router>
      <AppContextProvider>
        <Header />
        <Suspense>
          <Routes />
        </Suspense>
      </AppContextProvider>
    </Router>
  );
};
