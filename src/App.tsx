import { Router, useRoutes } from '@solidjs/router';
import { AppContextProvider } from './AppContext';
import { Nav } from './components/Nav';
import { Suspense } from 'solid-js';
import { preventSmoothScrollOnTabbing } from './utils';
import { routes } from './routes';

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
