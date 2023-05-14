import { createComputed, createSignal } from 'solid-js';
import { useRouteData } from '@solidjs/router';

export const page = {
  scrollY: 0,
};

export const [routeReadyState, setRouteReadyState] = createSignal(
  {
    loading: false,
    routeChanged: false,
    loadingBar: false,
  },
  { equals: false },
);

let init = true;

export const useRouteReadyState = () => {
  const restorePageHeight = () => {
    const pageEl = document.body;
    pageEl.style.minHeight = '';
  };

  const setRouteReady = (): boolean | void => {
    setRouteReadyState((prev) => ({ ...prev, loading: false, loadingBar: false }));
    if (init) {
      init = false;
      return true;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    restorePageHeight();
  };

  try {
    const data = useRouteData<{ loading: boolean }>();

    createComputed(() => {
      if (!data.loading) return setRouteReady();
    });
  } catch (err) {
    return setRouteReady();
  }
};
