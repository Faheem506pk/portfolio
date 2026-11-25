---
name: kds-printing
description: How to build and change printing in the Tabtake KDS React Native app (Tabtake-devices-apps/kds-app) - thermal printer connectivity over Bluetooth Classic, BLE, Wi-Fi/Ethernet TCP 9100 and (web only) USB, fast HTML receipt and kitchen ticket printing, ESC/POS raster encoding, auto-print, printer settings, and the print-related API endpoints the KDS calls. Use this skill whenever work touches printers, receipts, kitchen tickets, invoices, ESC/POS, the tabtake-printer native module, PrinterSettings.tsx or PrintReceiptModal.tsx in the KDS or CFD apps, even if the user only says "print", "printer not working", "receipt looks wrong" or "make printing faster". Not for the root Vite app's own printerHardware code or storefront-next.
---

# KDS printing

The full design, with reasoning, platform matrix, performance budget and phases, is in
`Tabtake-devices-apps/docs/kds-printing-plan.md`. Read the section relevant to your task before writing code;
this file holds the rules that keep the implementation coherent.

## Where things live

| Concern | Path |
|---|---|
| Native module (Kotlin, Expo Modules API) | `kds-app/modules/tabtake-printer/` |
| Web/PWA implementation of the same JS API | `kds-app/modules/tabtake-printer/src/TabtakePrinter.web.ts` |
| API calls for printers, invoice HTML, claims, jobs | `kds-app/src/printing/printerApi.ts` |
| Resolve printer for a doc type, fetch + cache HTML, dispatch | `kds-app/src/printing/printService.ts` |
| Printer list, pairing, status (zustand) | `kds-app/src/printing/usePrinterStore.ts` |
| Auto-print on new order | `kds-app/src/printing/autoPrint.ts` |
| Server receipt rendering | `supabase/functions/api-v1/invoiceHtml.ts`, `routes/invoice.ts`, `routes/printing.ts` |
| Reference implementation (web app, read only) | `src/lib/printerHardware/` at the repo root |

If a file in this table does not exist yet, you are in an early phase of the plan; create it where listed.

## Core rules and why

1. **API only, never Supabase in the KDS.** Printers come from `GET /printers` and `GET /printers/defaults`,
   receipts from `GET /orders/{id}/invoice?doc_type=&printer_id=&raw=true`. The KDS is a device client
   authenticated with a device token; direct table access would bypass permissions and the API contract the
   other device clients rely on. If something is missing from the API, add an endpoint in
   `supabase/functions/api-v1` and document it in `openapi.ts`, do not reach for `supabase-js`.

2. **The server decides what a receipt looks like.** Print the HTML the API returns. Do not rebuild receipt
   layout in React Native components; the owner designs templates in the web app and a client-drawn receipt
   drifts from them. The preview is the same HTML in `react-native-webview` (an `iframe srcdoc` on web).
   This includes kitchen tickets: there is no text-mode ESC/POS path, because text mode cannot reproduce
   the template's fonts, sizes, banners, logo or QR codes. Make printing faster in the pipeline, never by
   printing something different from the API's HTML.

3. **HTML to bytes stays native.** On Android the HTML string goes into the module, gets drawn by a warm
   offscreen WebView at printer dot width (58 mm = 384 dots, 80 mm = 576 dots), dithered and encoded as
   ESC/POS `GS v 0` in 256-row bands, and written to the socket in Kotlin. Only a small result object comes
   back. Shipping bitmaps or base64 across the JS bridge is what makes RN printing slow, so avoid it.

4. **Zero remote assets in print HTML.** Every remote font, QR image or logo fetch adds latency and fails
   offline. QR and barcodes are inline SVG generated server-side, fonts are a system stack or an embedded
   subset, the logo is inlined (`inline_assets=true`). If you see `api.qrserver.com`, `barcodeapi.org` or
   `fonts.googleapis.com` in `invoiceHtml.ts`, removing them is a fix, not a refactor: they also leak
   customer phone numbers and addresses to third parties.

5. **One serial queue per printer, never auto-reprint after bytes are sent.** Interleaved jobs corrupt
   output; a duplicate kitchen ticket confuses the line more than a missing one, which staff can reprint.
   Retry only failures that happened before any byte was written (connect timeout, refused).

6. **Auto-print claims through the API.** Several tablets and web tabs watch the same store. Call
   `POST /orders/{id}/print-claims` and print only on 201; a 409 `ALREADY_CLAIMED` means another device has it.

7. **Platform scope.** Android: Bluetooth (Classic SPP first, BLE fallback) and Wi-Fi/Ethernet (TCP 9100,
   same code path, the label is for the owner). USB is web/PWA only (Web Serial, or the `printer-bridge` for
   CUPS queues). iOS, if ever: TCP and BLE only, Apple blocks SPP. Hide connection options a platform cannot
   do rather than showing them disabled with no explanation.

8. **Shared vs per-tablet config.** IP, port, paper width, density, cut, feed and template live on the server
   printer row. The Bluetooth MAC or BLE id a tablet paired with is per tablet (AsyncStorage keyed by
   printer id), mirrored to `identifier` as `bt:<MAC>` only for visibility.

9. **Async buttons.** Print, Test print, Connect and Scan buttons show a spinner, are disabled in flight and
   use a `useRef` re-entrancy guard, via `kds-app/src/hooks/useAsyncAction.ts` (the KDS's own copy; never
   import another app's hook). See `.claude/rules/async-button-safety.md`.

10. **Surface failures.** Map native result codes (`UNREACHABLE`, `PERMISSION`, `TIMEOUT`, `RENDER`,
    `PAPER_OUT`) to plain messages with a Reprint action. A failed auto-print shows a persistent banner. Never
    `catch {}` silently: a kitchen that does not know a ticket failed is the worst outcome here.

## Native gotchas worth knowing before you debug

- Many cheap SPP printers refuse `createRfcommSocketToServiceRecord`; fall back to the reflection
  `createRfcommSocket(1)`. Cancel Bluetooth discovery before connecting or the connect is slow or fails.
- Some Bluetooth printers drop data on large writes; write in chunks (around 2 to 4 KB) with a short pause.
- Android 12+ needs `BLUETOOTH_CONNECT` and `BLUETOOTH_SCAN` at runtime; declare them in the module's config
  plugin, never by editing `android/` (it is generated, see `kds-app/AGENTS.md`).
- Wait for `document.fonts.ready` and every `img.decode()` before drawing the WebView, with a hard timeout
  (about 3 s) so a dead logo URL never blocks a ticket.
- The module needs a development build (`npx expo run:android` or EAS development profile); Expo Go cannot
  load it. Install JS packages with `npx expo install`, not `npm install`.
- Expo APIs change every SDK. Check `expo` in `package.json` and read the matching versioned docs before
  using an Expo or Expo Modules API from memory.

## Porting from the web app

`src/lib/printerHardware/` is proven code: `rasterEncode.ts` (banding, Atkinson dither),
`receiptEncoder.ts` (text ESC/POS, width to columns), `autoPrint.ts` (claim semantics),
`transports/*` (Web Serial, Web Bluetooth, bridge). Port the logic into the KDS (Kotlin for native, TS for
`TabtakePrinter.web.ts`), keeping the arithmetic identical so both apps print the same dots. Copy, do not
import across apps: they have separate dependencies and builds.

## Checking your work

- Log `ms.render`, `ms.encode`, `ms.send` from every print and compare against the budget in plan section 5
  (render under 300 ms warm, TCP send about 100 ms for an 80 mm receipt).
- Test on real hardware where possible: one 80 mm LAN printer, one 58 mm SPP Bluetooth printer.
- Respect the repo CPU rules: no parallel builds across the three apps, one Gradle build at a time.
