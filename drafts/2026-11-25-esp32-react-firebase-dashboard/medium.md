<!--
DRAFT 1, topic 58 (ESP32 + React + Firebase dashboard), free track. Written with AI assistance from the REAL public code of the author's personal project PlantPulse (github.com/Faheem506pk/PlantPulse, web dashboard, commit b0f2395, 2026-03-09) and official Firebase docs.
Medium policy: AI-written text. It needs the disclosure sentence (included), must NOT be paywalled, and the author should rewrite it in his own words. To paywall it he must write it himself.
Allowed project: PlantPulse only. No employer or client projects are mentioned. The ESP32 firmware and mobile app live in private repositories and were NOT read.
SECURITY NOTE FOR THE AUTHOR: the public repo contains a literal "security code" used to gate applying presets. This draft deliberately does not print it. Treat that value as public, change it, and stop relying on it (see section 6).
Title options:
1. My IoT Dashboard Drew Fake Trend Lines: A Code Review of PlantPulse
2. Four Things I Found Reviewing My Own ESP32 and React Dashboard
3. Live Telemetry or Decoration? Reviewing the Data Flow in My Plant Monitor
Subtitle: A review of PlantPulse, a React and Firebase dashboard for an ESP32 plant monitor: the real-time data flow, and four things I would fix.
Tags: IoT, React, Firebase, ESP32, Software Development
Author must confirm: (a) the first-person statements marked [AUTHOR], (b) how the firmware actually reads and writes the paths named here, (c) that you are happy to critique your own public code, (d) the disclosure line.
Sources accessed 2026-11-25 are listed at the end.
-->

# My IoT Dashboard Drew Fake Trend Lines: A Code Review of PlantPulse

*A review of PlantPulse, a React and Firebase dashboard for an ESP32 plant monitor: the real-time data flow, and four things I would fix.*

PlantPulse is a web dashboard I built for a plant monitor. It shows temperature, humidity, soil moisture and light, and it lets you set limits and move a servo. When I reread the code, the most interesting problems were not in the hardware part. They were in how the screen decides what to show.

*This story was written with the assistance of an AI writing program. I checked the code excerpts against my repository and the Firebase claims against the linked docs.* [AUTHOR: keep only if true, and rewrite in your own words.]

This is a review of the public web repository only. The firmware and the mobile app are in separate private repositories that I did not use for this article, so I will not claim anything about how the device behaves.

## How the data flows

The dashboard is React with Vite. It uses Firebase for sign-in, for stored presets and for the live values. Live values come from the Realtime Database. Sensor readings sit at paths such as `DHT_11/Temperature`, `DHT_11/Humidity`, `LDR` and `Moisture`. The limits the system should hold, such as `tempup` and `tempdown`, are stored beside them, and commands such as `servoangle`, `autoWatering` and `growLights` are written to the same database.

Reading is done with one `onValue` listener per value, each feeding a `useState`. Writing uses `set`. Applying a saved preset uses a single `update` call that writes all six limits together, which is a good pattern because the device never sees half a preset.

Some writes, the servo angle, auto watering and grow lights, go through a second, named Firebase app configured with its own set of environment variables, while the reads and the preset updates use the main one. [AUTHOR: confirm whether both apps point at the same database and why you split them.]

## Finding 1: the listeners are never detached

The hook that reads the sensor values registers twelve `onValue` listeners inside a `useEffect` and never removes them:

```js
useEffect(() => {
  const tempRef = ref(database, "DHT_11/Temperature");
  onValue(tempRef, (snapshot) => setTemperature(snapshot.val()));
  // ...eleven more listeners...
}, []);
```

The Firebase reference says to invoke the returned unsubscribe callback to stop receiving updates, and the Realtime Database guide has a section on detaching listeners. The hook is used by three components, the dashboard, the top bar and the admin view, so every mount adds twelve more listeners that keep running after the component is gone. For a screen that lives for the whole session it is mostly harmless. If someone navigates back and forth, it becomes duplicated updates and wasted bandwidth.

The fix is small: keep the unsubscribe functions and return a cleanup.

```js
useEffect(() => {
  const unsubscribers = [
    onValue(ref(database, "DHT_11/Temperature"), (s) => setTemperature(s.val())),
    // ...the rest...
  ];
  return () => unsubscribers.forEach((off) => off());
}, []);
```

## Finding 2: some of the "live" trend lines are random

Each metric card shows a small sparkline under the value, beside a "Live telemetry" label. The sparkline data comes from a helper called `generateSimulatedData`, which builds points around the current value with `Math.random()`. The main trend chart is more honest: it accumulates real readings into a list of the last 24 points. But it only holds what arrived since the page loaded, and when the list is empty it falls back to the same random generator. The 24H, 7D and 30D buttons only change how many random points that fallback draws.

A dashboard that mixes real and generated numbers without saying so teaches the reader to trust a picture that is not measured. The repair is either to label the sparkline as a demo or to remove it, and to store real history, for example by writing a reading to a log path on a schedule, so a range button shows range data.

## Finding 3: the same limit means different things in different places

Each limit has an "up" and a "down" value, and the down value is derived from the up value to create a gap, a simple hysteresis band so the system does not switch on and off at the boundary. The numbers for that gap do not agree across the code:

| Place | Moisture "down" | Moisture range allowed |
|---|---|---|
| Preset form | up minus 10 | 10 to 100 |
| Direct write helper | up minus 20 | 20 to 100 |

The temperature range differs too: 10 to 50 in the form and 2 to 40 in the helper. The helper also writes to `Moistureup` with a capital M while the rest of the app uses `moistureup`. I treat Realtime Database path names as case-sensitive, so a different spelling would be a different location. [AUTHOR: confirm with a quick test in the console.] I could not find any component that calls the helper, so it looks like dead code, but dead code like this is how the next bug starts.

The fix is to define the limits, the gaps and the path names once, in a shared constants file, and import them everywhere.

## Finding 4: a security code that anyone can read

Applying a preset asks for a "security code". The code is a literal string in the source, compared in the browser, in two files. Because the repository is public, so is the code. Anything that ships to the browser can be read by whoever uses the browser, even in a private repository. The real control for a device that can water a plant is the database security rules, and I did not verify mine. [AUTHOR: read your Realtime Database rules and describe them, then replace the code check with rules that require a signed-in user with the right role.]

## A checklist for a small IoT dashboard

1. Detach every listener you attach.
2. Never draw data that was not measured without a visible "demo" label.
3. Keep paths, limits and hysteresis gaps in one shared file.
4. Write multi-value changes with one atomic `update`.
5. Treat anything in the browser as public, including codes and flags.
6. Enforce who can write device commands in the database rules, not in the interface.

## Limits of this review

I read one public repository at one commit. I did not run it against real hardware for this article, I did not read the firmware, and I did not check the deployed database rules. The findings are about the web code only.

If you build dashboards for hardware, which of your charts show data that really came from a sensor?

## Sources (accessed 2026-11-25)
- PlantPulse web dashboard (public), commit b0f2395, 2026-03-09: https://github.com/Faheem506pk/PlantPulse
- Firebase, Realtime Database JavaScript reference (onValue returns an unsubscribe callback): https://firebase.google.com/docs/reference/js/database.md
- Firebase, Read and Write Data on the Web (detaching listeners): https://firebase.google.com/docs/database/web/read-and-write
- Firebase, API keys and Security Rules: https://firebase.google.com/docs/projects/api-keys
