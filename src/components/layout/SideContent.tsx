import { Accessor, Component, JSX, Setter } from 'solid-js';
import { routeReadyState, useRouteReadyState } from '../../utils/routeReadyState';
import Dismiss from 'solid-dismiss';
import { Icon } from 'solid-heroicons';
import { chevronRight } from 'solid-heroicons/outline';

export const SideContent: Component<{
  toggleVisible: Accessor<boolean>;
  setToggleVisible: Setter<boolean>;
  aside: JSX.Element;
  content: JSX.Element;
}> = (props) => {
  let menuButton!: HTMLButtonElement;

  useRouteReadyState();

  return (
    <div dir="ltr" class="relative flex min-h-screen flex-auto">
      <div class="container flex">
        <div class="absolute left-0 z-20 h-full rounded-br-lg lg:static">
          <button
            class={`reveal-delay fixed right-3 top-20 rounded-lg bg-solid-medium text-white transition duration-500 lg:hidden`}
            classList={{
              'rotate-90': props.toggleVisible(),
              'opacity-0': routeReadyState().routeChanged,
            }}
            ref={menuButton}
          >
            <Icon class="h-7 w-7" path={chevronRight} />
          </button>
          <Dismiss
            show
            class="sticky top-[3.5rem] w-0 lg:col-span-3 lg:w-auto"
            menuButton={menuButton}
            open={props.toggleVisible}
            setOpen={props.setToggleVisible}
          >
            <div
              class={
                'w-[85vw] overflow-auto bg-white p-10 shadow-2xl dark:bg-solid-darkbg ' +
                'fixed left-0 top-14 transition-transform dark:bg-solid-darkLighterBg lg:translate-x-0 lg:duration-0 ' +
                'max-w-xs duration-300 lg:top-12 lg:w-auto lg:flex-col lg:p-0 lg:shadow-none ' +
                'relative z-50 lg:flex'
              }
              classList={{
                '-translate-x-full shadow-none': !props.toggleVisible(),
                'translate-x-0 shadow-2xl': props.toggleVisible(),
              }}
              style={{ height: 'calc(100vh - 4rem)', top: 0 }}
            >
              {props.aside}
            </div>
          </Dismiss>
        </div>
        <div class="w-full bg-white p-5 dark:bg-solid-darkbg md:p-10 lg:w-9/12">
          {props.content}
        </div>
      </div>
    </div>
  );
};
