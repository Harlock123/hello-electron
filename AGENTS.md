# AGENTS.md

Notes for anyone, human or AI agent, changing this code.

## What this is

An early Electron experiment (window title "Opus Tool experimental"): the start of a two-panel file manager. Each
panel lists a folder's files in a canvas grid; double-clicking opens a folder or hands a file to the system
(`xdg-open`, `open` or `shell.openExternal`). The button area below is mostly placeholders. It uses Electron 16 with
`nodeIntegration` on, so the page script uses Node's `fs`, `path`, `os` and `child_process` directly.

## Commands

```bash
npm install
npx electron main.js                              # run it
npm start                                         # runs "electron .\main.js": works from a Windows shell only
```

- `package.json` names `index.js` as `main`, which does not exist, so `electron .` will not start it.
- There are no tests (`npm test` only prints an error).

## Layout

- `main.js`: the Electron main process. It opens one 800x600 window with the menu bar hidden and loads
  `index.html`.
- `index.html`: the page. Two path boxes, two `<canvas class="LCTDataGrid">` panels and five rows of buttons;
  it loads jQuery, `scripts/LCTDataGrid.js` and `myapp.js`.
- `myapp.js`: the renderer logic. It fills the grids (`POPGridWithFiles`), handles the path boxes and back
  buttons, double-clicks, and the "Root - Home" button (`RootSysHandler`, using `node-disk-info`).
- `scripts/LCTDataGrid.ts`: a canvas-drawn data grid control, with scroll bars, titles and outlines.
  `LCTDataGrid.js` and its `.map` are its compiled output, committed beside it.
- `scripts/jquery-1.10.2.min.js`: a vendored jQuery, used by the page.
- `css/styles.css`, `assets/`: styles, icons and button images.

## Rules that keep it working

- **The compiled grid is what runs.** The page loads `scripts/LCTDataGrid.js`. If you edit `LCTDataGrid.ts`,
  recompile it with TypeScript (not a dependency here) and commit both files together.
- **Opening files is platform-specific.** The double-click handlers use `xdg-open` on Linux,
  `shell.openExternal` on Windows and `open` otherwise. Check both handlers (left and right grids) when changing one; they are copies of each other.
- `nodeIntegration: true` with `contextIsolation: false` lets the page run any Node code. Don't load remote
  content into this window.

## Making a change

- Run it with `npx electron main.js` and try both panels by hand.
- Keep `README.md`'s run instructions in step with `package.json`.

There is no CI workflow.
