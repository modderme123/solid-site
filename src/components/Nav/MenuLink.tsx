import { ParentComponent, Show, batch, createSignal, onMount } from 'solid-js';
import { page, reflow, setRouteReadyState } from '../../utils';
import { Icon } from 'solid-heroicons';
import { NavLink } from '@solidjs/router';
import { arrowTopRightOnSquare } from 'solid-heroicons/solid';
import { createEventListener } from '@solid-primitives/event-listener';

export type LinkTypes = {
  title: string;
  description: string;
  path: string;
  external?: boolean;
  links?: LinkTypes[];
  direction?: 'ltr' | 'rtl';
};
export type MenuLinkProps = {
  setSubnav: (children: LinkTypes[]) => void;
  setSubnavPosition: (position: number) => void;
  closeSubnav: () => void;
  clearSubnavClose: () => void;
} & LinkTypes;

export const MenuLink: ParentComponent<MenuLinkProps> = (props) => {
  let linkEl!: HTMLAnchorElement;

  // Only rerender event listener when children change
  if (props.links) {
    onMount(() => {
      createEventListener(linkEl, 'mouseenter', () => {
        props.clearSubnavClose();
        batch(() => {
          props.setSubnav(props.links!);
          props.setSubnavPosition(linkEl.getBoundingClientRect().left);
        });
      });
      createEventListener(linkEl, 'mouseleave', () => props.closeSubnav());
    });
  }
  onMount(() => {
    createEventListener(linkEl, 'mousedown', () => {
      setRouteReadyState((prev) => ({ ...prev, loadingBar: true }));
      page.scrollY = window.scrollY;
      reflow();
      const [targets, setTargets] = createSignal([linkEl]);
      createEventListener(targets, 'mouseleave', () => {
        setRouteReadyState((prev) => ({ ...prev, loadingBar: false }));
        removeEvents();
      });
      createEventListener(targets, 'click', () => {
        setRouteReadyState((prev) => ({ ...prev, loadingBar: false }));
        removeEvents();
      });
      const removeEvents = () => setTargets([]);
    });
    if (!window.location.pathname.startsWith(props.path)) return;

    linkEl.scrollIntoView({ inline: 'center', behavior: 'instant' as ScrollBehavior });
  });

  const onClick = () => {
    if (window.location.pathname.startsWith(props.path)) {
      window.scrollTo({ top: 0 });
      return;
    }
    const pageEl = document.body;
    pageEl.style.minHeight = `${document.body.scrollHeight}px`;
    reflow();
    setRouteReadyState((prev) => ({
      ...prev,
      loadingBar: true,
      loading: true,
      routeChanged: true,
    }));
  };

  return (
    <li>
      <NavLink
        href={props.path}
        target={props.external ? '_blank' : undefined}
        class="m-0 inline-flex items-center whitespace-nowrap rounded px-2 py-2 text-[14px] transition hover:bg-gray-200 hover:text-black dark:hover:bg-solid-darkLighterBg dark:hover:text-white sm:m-1 sm:px-4"
        activeClass="bg-solid-light text-white"
        onClick={() => !props.external && onClick()}
        noScroll
        ref={linkEl}
      >
        <span>{props.title}</span>
        <Show when={props.external}>
          <Icon path={arrowTopRightOnSquare} class="h-4 w-4 opacity-60" />
        </Show>
      </NavLink>
    </li>
  );
};
