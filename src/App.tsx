import { Suspense } from 'solid-js';
import { useRoutes, Router } from '@solidjs/router';
import { routes } from './routes';
import { AppContextProvider } from './AppContext';
import { preventSmoothScrollOnTabbing } from './utils';
import { Nav } from './components/Nav';

export const App = () => {
  const Routes = useRoutes(routes);

  preventSmoothScrollOnTabbing();

  return (
    <Router>
      <AppContextProvider>
        <Nav />
        <Suspense>
          <Routes />
        </Suspense>
      </AppContextProvider>
    </Router>
  );
};
