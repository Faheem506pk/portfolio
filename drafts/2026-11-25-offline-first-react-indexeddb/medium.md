<!--
DRAFT 1, topic 30 (offline-first React with IndexedDB), free track. Written with AI assistance from the REAL public code of the author's personal project StitchSmart (github.com/Faheem506pk/stitch-smart-admin-panel, commit 5951cc3, 2026-02-13) and the official Firestore offline docs.
Medium policy: AI-written text. It needs the disclosure sentence (included), must NOT be paywalled, and the author should rewrite it in his own words. To paywall it he must write it himself.
Allowed project: StitchSmart only. No employer or client projects are mentioned.
Overlap note: topic 40 (permissions review) is also a StitchSmart code review. Publish the two a few days apart and keep their angles different (this one is about offline data flow).
Title options:
1. I Called My App Offline-First. The Code Says Offline for One Screen.
2. Four Bugs in My Hand-Rolled Offline Sync (and What I'd Do Instead)
3. What "Offline Support" Actually Means in a React and Firebase App
Subtitle: A review of the IndexedDB layer and sync queue in StitchSmart, a React, Zustand and Firebase admin panel for tailor shops.
Tags: React, IndexedDB, Offline First, Firebase, Software Development
Author must confirm: (a) the first-person statements marked [AUTHOR], (b) whether you ever tested offline mode in the browser, (c) that you are happy to critique your own public code, (d) the disclosure line.
Sources accessed 2026-11-25 are listed at the end.
-->

# I Called My App Offline-First. The Code Says Offline for One Screen.

*A review of the IndexedDB layer and sync queue in StitchSmart, a React, Zustand and Firebase admin panel for tailor shops.*

When I describe StitchSmart, I say it supports offline use. I wrote that line, so I decided to check it against the code. The honest answer is more modest than the sentence.

*This story was written with the assistance of an AI writing program. I checked the code excerpts against my repository and the Firestore claim against the linked docs.* [AUTHOR: keep only if true, and rewrite in your own words.]

This is a code review of a public repository at one commit. I did not run the app offline for this article, so every statement below is about what the code does, not about what I observed in a browser. [AUTHOR: if you have tested it offline, add what happened.]

## What exists

StitchSmart has a small IndexedDB wrapper with five stores: customers, orders, employees, measurements and payments. It exposes generic helpers to read all records, add, update, get by id and delete, plus a `syncWithServer` function.

The surprise is where it is used. Only two files import it: a data seeder and the delivery service. The customer service, for example, reads and writes Firestore directly. So the offline layer covers the delivery screen, not the customers, orders or payments that make up most of the app.

I also searched the source, the Vite config, `package.json` and `index.html` for a service worker, Workbox or a PWA plugin and found none. Without one, I would expect the page itself not to load when you open it with no connection. Data that is already in IndexedDB cannot help if the app shell never arrives. That is a prediction from the code, not a test result. [AUTHOR: verify by turning on offline mode in DevTools and reloading.]

## The offline write path

Here is the part that is implemented: changing a delivery status. When the app is online it updates Firestore. Otherwise it updates the record in IndexedDB and leaves a note for later in `localStorage`:

```ts
// offline branch (simplified)
await update(STORES.ORDERS, updatedDelivery);
localStorage.setItem(`sync_delivery_${id}`, JSON.stringify({ id, status, updatedAt }));
toast.success(`Delivery status updated to ${status} (offline)`);
```

When the connection returns, a sync function scans `localStorage` for keys that start with `sync_delivery_`, sends each one to Firestore and removes it. As a design this is a tiny outbox: write locally, remember what is pending, replay later. The idea is right. The details have four problems.

## Problem 1: a failed sync deletes the pending change

The replay loop sends each change with `updateDocument` and then removes the pending key. But `updateDocument` does not throw when Firestore rejects the write. It catches the error and returns `false`:

```ts
try {
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
  return true;
} catch (error) {
  console.error(`Error updating document in ${collectionName}:`, error);
  return false;
}
```

The sync loop ignores that return value:

```ts
await firestoreService.updateDocument(DELIVERY_COLLECTION, id, deliveryData);
localStorage.removeItem(key);
```

So if the write fails, for example because a rule rejects it or the document was deleted, the key is removed anyway and the user sees a success message. The change is gone with no trace. The fix is to remove the key only when the call returns `true`.

## Problem 2: the success message does not depend on success

In the offline branch the code updates the local record only if it finds one, but it sets `success = true` and shows the "(offline)" toast either way. If the delivery was never saved in IndexedDB, the user is told it worked while only the pending note exists.

## Problem 3: the queue is a second store, and it keeps one slot per item

The data goes to IndexedDB and the pending note goes to `localStorage`. Those are two separate stores, and no transaction covers both, so a crash between the two writes leaves them out of step. The note is also keyed by delivery id, so two offline edits to the same delivery overwrite each other. For a status field, last write wins may be fine. For anything where order or history matters, it loses information.

## Problem 4: the sync function is a placeholder

`syncWithServer` reads every local record, logs it to the console, writes a "last sync" timestamp and returns. Its own comments list the real work as a to-do: get the last sync time, fetch remote changes, apply them locally and send local changes. It is labeled as an example in the file, but it is called from the delivery sync, and it logs full records, which for a shop app can include customer data.

## What I would do instead

Firestore has its own optional offline persistence. Google's documentation describes it as caching the data your app uses so it stays available offline, and says that once enabled, Firebase coordinates online and offline access and synchronizes local data when the device is back online, without changing how your code reads data. I found no use of it in the repository. Before maintaining a hand-built cache and queue, it is worth deciding whether the built-in feature covers the need.

If you do need your own queue, a sketch worth testing:

1. Keep the outbox in IndexedDB, not `localStorage`, with one row per change: id, operation, payload, created time and attempt count.
2. Write the local data and the outbox row in one IndexedDB transaction.
3. Replay in creation order, and delete a row only after the server confirms the write.
4. Keep failed rows, count attempts, and show the user what is stuck.
5. Add a service worker so the app shell loads without a connection.

## A checklist before you say "offline-first"

1. Can the app start with no network, or only continue if it is already open?
2. Which screens work offline, and which go straight to the server?
3. Is every queued change removed only after the server says yes?
4. What happens when two offline edits touch the same record?
5. Does the user see what is pending or failed?
6. Did you test it with the network off, not just read the code?

## Limits of this review

I read one public repository at one commit and did not run it offline. A service worker, a Firestore setting or a rule could exist outside the files I searched. This is a review of design and code paths, not a test report.

When you tell people your app works offline, which screens did you actually test with the network off?

## Sources (accessed 2026-11-25)
- StitchSmart repository (public), commit 5951cc3, 2026-02-13: https://github.com/Faheem506pk/stitch-smart-admin-panel
- Firebase, Access data offline (Cloud Firestore): https://firebase.google.com/docs/firestore/manage-data/enable-offline
- MDN, IndexedDB API: https://developer.mozilla.org/docs/Web/API/IndexedDB_API
