import { ParentComponent } from 'solid-js';

export const LanguageSelector: ParentComponent<{ ref: HTMLButtonElement }> = (props) => (
  <button
    aria-label="Select Language"
    ref={props.ref}
    class="focus:color-red-500 border-solid-100 my-3 ml-2 h-10 w-full cursor-pointer rounded-md border bg-translate bg-24 bg-center bg-no-repeat px-6 pl-4 pt-4 text-sm hover:border-gray-500 dark:border-gray-600 dark:brightness-150 dark:hover:border-gray-500"
  />
);
