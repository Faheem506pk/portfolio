# Storefront floating chip pattern (storefront-next only)

Any new corner-draggable, collapsible floating widget on the customer storefront (the closed-store notice, the last-order-status chip, and any future one, a basket reminder, a promo nudge, etc.) **MUST** reuse this pattern, not reimplement drag/corner/collapse logic per widget.

This was extracted after `ClosedStoreDialog.tsx`'s notice chip and `LastOrderStatusChip.tsx` were first built with the same drag/corner/collapse state duplicated between them: two near-identical Zustand stores, two copies of the same positioning math.

## The pieces

- **`storefront-next/src/hooks/useCornerDrag.ts`**: Pointer Events drag mechanics. Tracks a movement threshold to distinguish a drag from a tap/click, snaps to whichever screen corner the widget ends up closest to on release, and only claims `setPointerCapture` once a real drag is confirmed. Claiming it eagerly on every pointerdown retargets the native `click` event to the dragged element, silently breaking nested buttons like a collapse control, this was a real bug, not a hypothetical one.
- **`storefront-next/src/stores/floatingChipStore.ts`**: ONE generic Zustand `persist` store for every chip's corner + collapsed state, keyed by an arbitrary string. Never add a new per-widget store for this; pass a unique key instead (e.g. `` `closed:${storeId}` ``, `` `lastOrder:${storeId}:${orderId}` ``). Two different chips must use different key namespaces so dragging/collapsing one never affects another.
- **`storefront-next/src/lib/chipCorners.ts`**: the one `ChipCorner -> Tailwind classes` mapping (`CORNER_CLASSES`), using logical `start`/`end` (not `left`/`right`) so it mirrors correctly under the Arabic/RTL storefront.
- **`storefront-next/src/hooks/useFloatingChip.ts`**: combines all three above into one call. This is the hook every chip component actually uses.

## Usage shape

```tsx
const { cornerClassName, collapsed, setCollapsed, elRef, isDragging, dragStyle, handlers } =
  useFloatingChip(`myChip:${someId}`);

<div className={cn("fixed z-40", cornerClassName)}>
  <div ref={elRef} {...handlers} style={dragStyle} className={cn(!isDragging && "transition-transform duration-200")}>
    {/* chip content, e.g. a collapse button calling setCollapsed(true) */}
  </div>
</div>
```

Pass `key` as `null` when the widget has nothing to show yet (no store/order resolved). `useFloatingChip` falls back to the default corner and a no-op collapse setter, and the caller should just not render in that case.

## Don't

- Don't add a new Zustand store per chip for corner/collapsed state. Extend `floatingChipStore.ts`'s key space instead.
- Don't recompute the corner-to-class mapping locally. Import `CORNER_CLASSES` from `chipCorners.ts` (or just use `useFloatingChip`'s `cornerClassName`).
- Don't call `setPointerCapture` on `pointerdown`. See `useCornerDrag.ts`'s own comment on why that breaks nested click handlers.
