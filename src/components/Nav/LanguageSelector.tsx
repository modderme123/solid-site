import { Icon } from 'solid-heroicons';
import { ParentComponent } from 'solid-js';
import { language } from 'solid-heroicons/solid';

export const LanguageSelector: ParentComponent<{ ref: HTMLButtonElement }> = (props) => (
  <button
    aria-label="Select Language"
    ref={props.ref}
    class="ml-2 h-10 cursor-pointer rounded-md border border-gray-600 px-3 brightness-150 hover:border-gray-500"
  >
    <Icon path={language} class="h-6 w-6" />
  </button>
);
