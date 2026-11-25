<!--
DRAFT 1, topic 40 (role-based access), free track. Written with AI assistance from the REAL public code of the author's personal project StitchSmart (github.com/Faheem506pk/stitch-smart-admin-panel, commit 5951cc3, 2026-02-13) and official docs.
Medium policy: AI-written text. It needs the disclosure sentence (included), must NOT be paywalled, and the author should rewrite it in his own words. To paywall it he must write it himself.
Allowed project: StitchSmart only. No employer or client projects are mentioned.
Title options:
1. My Admin Panel Hid the Buttons, Not the Data: What Client-Side Role Checks Can't Protect
2. Client-Side Permissions Are a UX Feature, Not Security: A Review of My Own React Admin Panel
3. I Reviewed the Permission System in My Own React App and Found the Gap
Subtitle: A review of the role and permission code in StitchSmart, a React, Zustand and Firebase admin panel, and where enforcement really belongs.
Tags: React, Firebase, Web Security, TypeScript, Software Development
Author must confirm: (a) first-person statements marked [AUTHOR], (b) what your deployed Firestore security rules actually say (the repository has no rules file), (c) you are happy to critique your own public code, (d) the disclosure line.
Sources accessed 2026-11-25 are listed at the end.
-->

# My Admin Panel Hid the Buttons, Not the Data: What Client-Side Role Checks Can't Protect

*A review of the role and permission code in StitchSmart, a React, Zustand and Firebase admin panel, and where enforcement really belongs.*

I built StitchSmart as a management system for tailor shops, with admin and employee roles and a permission matrix per section. When I reread its permission code, one question stood out: what actually stops an employee from doing something the interface hides?

*This story was written with the assistance of an AI writing program. I checked the code excerpts against my repository and the claims against the linked docs.* [AUTHOR: keep only if true, and rewrite in your own words.]

This is a review of my own public code. I will show what the app does, where the protection stops, and what I would move to the backend. I could not see my deployed Firebase settings from the repository, so I mark what I did not verify.

## How the permission system works

Each user has a role and a permission object per section: customers, orders, measurements, payments, employees and settings. Each section has view, add, edit and delete flags. Admins get everything, and employees get a default set that, for example, allows editing orders but not deleting them.

The check itself is small:

```ts
export const hasPermission = (section: string, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
  const { user } = useStore.getState();
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions?.[section]?.[action] === true;
};
```

A `ProtectedRoute` component uses it to show an "Access Denied" message instead of a page, and the sidebar uses it to hide links. For the user experience this works well: an employee never sees a button they cannot use.

## Where the user comes from

The `user` object, including `role` and `permissions`, lives in a Zustand store that uses the `persist` middleware:

```ts
{
  name: "tailor-shop-storage",
  partialize: (state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    lastSyncTime: state.lastSyncTime,
  }),
}
```

Zustand's `persist` defaults to `localStorage`. So the data that decides what the interface shows is stored in the browser, where the person using the browser can change it. A page that renders based on `user.role` can be made to render differently by editing that stored value. That alone only changes what is drawn on the screen. The real question is whether the server agrees.

## The part that decides it: backend rules

The app talks to Firestore directly from the browser. In that design, the database must enforce who can read and write what. Firebase's own documentation is explicit that security of Firestore data is enforced by Firebase Security Rules, together with App Check, and not by keeping the Firebase API key secret.

I looked for rules in the repository and found no rules file. That does not mean none exist, because rules can be edited in the Firebase console, and I have not recorded what mine say. [AUTHOR: open your Firebase console, read the deployed rules, and describe them here honestly. If they are open, say what you changed.]

Until the rules mirror the permission matrix, the matrix is only a convenience. A request that skips the interface never meets the check in `hasPermission`.

## Two smaller details in the same area

**A role decided by an environment variable.** The super admin is recognized by comparing the signed-in email with `VITE_SUPER_ADMIN_EMAIL`. Vite's documentation says `VITE_*` variables should not contain sensitive information such as API keys, because they are bundled into client code. An email address is not a secret, but using a client-visible value to grant the highest role means the decision is made in the browser. The grant should come from something the server controls, such as a role stored in the database and enforced by rules.

**API keys in `VITE_*` variables.** The Firebase web API key is fine to ship in client code according to Firebase's documentation, provided your rules and App Check do the real protection. The same reasoning does not automatically cover every key. Check each third-party key against that service's guidance before putting it in a `VITE_` variable.

## What each layer is for

| Layer | Job | Can it be trusted? |
|---|---|---|
| UI checks (`hasPermission`, `ProtectedRoute`) | Show only what the person can use | No, it is a convenience |
| Stored user in localStorage | Keep the session feeling fast | No, the user controls it |
| Firebase Security Rules | Decide who may read and write each document | Yes, this is the enforcement point |
| Roles in the database or auth tokens | The source of truth rules read | Yes, if only the server can change it |

## A checklist for your own app

1. Pick the one place where each permission is enforced. For a browser-to-Firestore app that is Security Rules.
2. Make sure every UI permission has a matching rule, including delete.
3. Do not let a client-visible variable or a stored object grant a role.
4. Test rules with the Firebase emulator, with a user who should be denied, and write the denial as a test.
5. Keep the UI checks. They make the product feel right, and nothing replaces them for that.
6. Review which keys you put in `VITE_` variables against each provider's documentation.

## Limits of this review

I read the code in one public repository at one commit. I did not test the live deployment, and I did not review the Firebase console. This is a code review, not a security audit, and it does not claim that anything is exploitable today. It points at a design gap that is worth closing.

If you build with Firebase from the browser, where do your permission checks actually live?

## Sources (accessed 2026-11-25)
- StitchSmart repository (public), commit 5951cc3, 2026-02-13: https://github.com/Faheem506pk/stitch-smart-admin-panel
- Vite, Env Variables and Modes: https://vite.dev/guide/env-and-mode
- Zustand, persist middleware: https://zustand.docs.pmnd.rs/reference/middlewares/persist
- Firebase, Learn about and manage API keys for Firebase: https://firebase.google.com/docs/projects/api-keys
