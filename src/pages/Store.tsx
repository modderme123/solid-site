import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { Footer } from '../components/Footer';
import { useRouteData } from '@solidjs/router';
import { useRouteReadyState } from '../utils/routeReadyState';
import type { CartUtilities, ShopifyProduct } from '../utils/shopify';
import { Icon } from 'solid-heroicons';
import { shoppingCart, chevronRight } from 'solid-heroicons/solid';
import { minusCircle, plusCircle, xCircle } from 'solid-heroicons/outline';
import Dismiss from 'solid-dismiss';

const Product: Component<{ details: ShopifyProduct; cart: CartUtilities }> = (props) => {
  const [current, setCurrent] = createSignal(props.details.variants[0].id);
  const [showInfo, setShowInfo] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const variant = createMemo(() => {
    for (const variant of props.details.variants) {
      if (variant.id == current()) {
        return variant;
      }
    }
    return null;
  });
  const quantity = props.cart.variantQuantity(current);
  const remove = async () => {
    setLoading(true);
    const itemToRemove = props.cart.cart.lines.find((line) => line.variant.id == current());
    if (itemToRemove) {
      await props.cart.remove([itemToRemove.id.toString()]);
    }
    setLoading(false);
  };
  const adjustQuantity = (quantity = 1) => {
    setLoading(true);
    props.cart
      .add([
        {
          variantId: current(),
          quantity,
        },
      ])
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };
  return (
    <div class="relative justify-center rounded-lg border border-t text-center transition duration-300 hover:border-solid-medium dark:border-solid-gray">
      <button class="pointer" onClick={() => setShowInfo(!showInfo())}>
        <Show when={variant() !== null}>
          <Show when={showInfo()}>
            <div
              innerHTML={`<b class="mb-3 block">${props.details.title}</b><div>${props.details.descriptionHtml}</div><div class="mt-5 text-center text-xs">Click to close info</div>`}
              class="z-5 text-md absolute h-full w-full overflow-auto rounded-lg bg-white/90 p-10 pt-20 text-left dark:bg-solid-darkgray/90"
            />
          </Show>
          <div class="absolute left-0 top-0 rounded-br-lg rounded-tl-lg border-b border-r bg-white/90  px-5 py-3 font-bold text-gray-500 dark:border-solid-gray dark:bg-solid-gray dark:text-gray-400">
            {props.cart.formatTotal(variant()!.priceV2.amount)}
          </div>
          <img class="rounded-t-lg" src={variant()!.image.src} />
        </Show>
        <div class="details flex justify-center bg-slate-50 py-4 dark:bg-solid-gray/20">
          <div>{props.details.title}</div>
        </div>
      </button>
      <div class="flex justify-center divide-white rounded-b border-t dark:border-solid-gray">
        <Show when={props.details.variants.length > 1}>
          <select
            class="w-4/6 rounded-bl-lg bg-transparent py-4 pl-4 text-xs dark:bg-solid-darkbg"
            onChange={(evt) => setCurrent(evt.currentTarget.value)}
          >
            <For each={props.details.variants}>
              {(variant) => <option value={variant.id}>{variant.title}</option>}
            </For>
          </select>
        </Show>
        <div class="flex w-2/6 content-center items-center justify-center py-2">
          <button
            title="Remove item"
            disabled={loading() || quantity() == 0}
            onClick={() => (quantity() == 1 ? void remove() : adjustQuantity(-1))}
            class="w-25 h-25 rounded-full text-lg font-semibold text-solid-light transition hover:opacity-60 disabled:hidden disabled:text-solid-light"
            classList={{
              'opacity-80': loading(),
            }}
          >
            <Icon class="h-8" path={minusCircle} />
          </button>
          <button
            title="Add item"
            disabled={loading()}
            onClick={() => adjustQuantity(1)}
            class="w-25 h-25 rounded-full bg-solid-light px-3 py-2 text-xs font-semibold text-white transition hover:text-solid-dark disabled:text-white"
            classList={{
              'opacity-80': loading(),
            }}
          >
            <Show fallback="Saving..." when={!loading()}>
              + Add
            </Show>
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart: Component<CartUtilities> = (props) => {
  const [loading, setLoading] = createSignal(false);
  const data = useRouteData<{
    products: ShopifyProduct[];
    loading: boolean;
    commerce: CartUtilities;
  }>();
  return (
    <div class="absolute right-0 top-[75px] max-h-[75vh] w-[500px] divide-y divide-slate-300 overflow-scroll rounded-lg border border-slate-300 bg-white shadow-xl dark:divide-solid-gray/80 dark:border-solid-gray/80 dark:bg-solid-darkgray md:right-[45px]">
      <Show
        fallback={<div class="w-full p-10 text-center">No items in cart.</div>}
        when={props.cart.totalItems !== 0}
      >
        <For each={props.cart.lines}>
          {(item: ShopifyBuy.LineItem) => {
            const remove = async () => {
              setLoading(true);
              await props.remove([item.id.toString()]);
              setLoading(false);
            };
            const adjustQuantity = (quantity = 1) => {
              setLoading(true);
              props
                .add([
                  {
                    variantId: item.variant.id,
                    quantity,
                  },
                ])
                .then(() => setLoading(false))
                .catch((err) => console.error(err));
            };
            return (
              <div class="grid w-full grid-cols-12 items-center gap-4 pr-2 transition hover:bg-slate-100 dark:hover:bg-solid-gray">
                <img
                  class="col-span-4 first:rounded-tl last:rounded-bl"
                  src={item.variant.image.src}
                />
                <div class="col-span-5 flex flex-col">
                  <b class="font-semibold">{item.title}</b>
                  <span class="text-xs">{props.formatTotal(item.variant.priceV2.amount)}/ea</span>
                  <div class="text-xs">
                    <b class="text-semibold">Price:</b>{' '}
                    {props.formatTotal(parseFloat(item.variant.priceV2.amount) * item.quantity)}
                  </div>
                </div>
                <div class="col-span-1">x {item.quantity}</div>
                <div class="space-x col-span-2 flex text-solid-medium dark:text-white">
                  <button
                    title="Remove item"
                    disabled={loading()}
                    onClick={() => (item.quantity == 1 ? void remove() : adjustQuantity(-1))}
                    class="flex items-center justify-center rounded-full transition duration-200 hover:opacity-70"
                  >
                    <Show fallback={<Icon class="h-8" path={xCircle} />} when={item.quantity !== 1}>
                      <Icon class="h-8" path={minusCircle} />
                    </Show>
                  </button>
                  <button
                    title="Add item"
                    disabled={loading()}
                    onClick={() => adjustQuantity(1)}
                    class="flex items-center justify-center rounded-full transition duration-200 hover:opacity-70"
                  >
                    <Icon class="h-8" path={plusCircle} />
                  </button>
                </div>
              </div>
            );
          }}
        </For>
        <div class="p-4 text-right dark:bg-solid-gray/30">
          <b>Subtotal: </b> US{data.commerce.formatTotal(data.commerce.cart.total)}
        </div>
        <div class="p-3">
          <button
            disabled={data.commerce.cart.totalItems == 0}
            onClick={() => (window.location.href = data.commerce.cart.checkoutURL)}
            class="text-md flex w-full items-center justify-center rounded-md bg-solid-medium transition hover:opacity-80 disabled:bg-gray-300"
          >
            <div class="flex w-full">
              <div class="flex w-full justify-center p-4 text-white">
                Checkout <Icon class="w-5" path={chevronRight} />
              </div>
            </div>
          </button>
        </div>
      </Show>
    </div>
  );
};

const Store: Component = () => {
  const data = useRouteData<{
    products: ShopifyProduct[];
    loading: boolean;
    commerce: CartUtilities;
  }>();
  const [showCart, setShowCart] = createSignal(false);
  let cartButtonEl;
  useRouteReadyState();
  return (
    <div class="relative flex flex-col">
      <div class="container sticky top-[55px] z-10 mx-auto flex justify-end px-5 dark:bg-transparent md:px-12">
        <div class="mt-3">
          <button
            ref={cartButtonEl}
            class="divide flex w-40 items-center justify-center space-x-5 divide-red-500 rounded-md border bg-white shadow-xl dark:border-transparent dark:bg-solid-medium"
          >
            <div class="flex h-12 items-center justify-center space-x-2">
              <Icon class="w-7 text-solid-medium dark:text-white" path={shoppingCart} />
              <div>Cart</div>
            </div>
            <figure class="borderjustify-center flex h-full items-center text-xs">
              {data.commerce.cart.totalItems}
            </figure>
          </button>
          <Dismiss menuButton={cartButtonEl} open={showCart} setOpen={setShowCart}>
            <Cart {...data.commerce} />
          </Dismiss>
        </div>
      </div>
      <div class="container relative py-5 pb-10 lg:px-12">
        <div class="px-5 md:px-0">
          Welcome to the <b>Solid Store</b>! All profits from the store goes back to Solid's
          OpenCollective to support our community.
          <div class="text-xs">Prices are listed in USD.</div>
        </div>
        <Show
          fallback={<div class="flex justify-center p-20">Loading store...</div>}
          when={!data.loading}
        >
          <div class="my-10 grid gap-8 px-5 md:grid-cols-2 md:px-0 lg:grid-cols-3 xl:grid-cols-4">
            <For each={data.products}>
              {(product: ShopifyProduct) => <Product cart={data.commerce} details={product} />}
            </For>
          </div>
        </Show>
      </div>
      <Footer />
    </div>
  );
};

export default Store;
