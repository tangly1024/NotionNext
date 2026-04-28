# Figma Node 265:41 Composition Handoff

## Source

Figma URL:
https://www.figma.com/design/xBgF8kT7suHPjwZnhnbCYc/%E4%B8%AA%E4%BA%BA%E7%AB%99%E8%8D%89%E7%A8%BF?node-id=265-41&m=dev

File key: `xBgF8kT7suHPjwZnhnbCYc`
Node ID: `265:41`
Node name: `交叉领域示意`

## Important Scope Note

This node currently contains only three visible symbol instances:

1. `Architecture`
2. `Visual Design`
3. `HCI`

It does **not** include the larger `Service Design / UX / Ixd` cluster that appears in `node 92:25`.

## Parent Frame

```json
{
  "id": "265:41",
  "name": "交叉领域示意",
  "type": "frame",
  "x": 192,
  "y": 231,
  "width": 587.0718994140625,
  "height": 494.3512878417969,
  "positioning": "relative container; children are absolutely positioned",
  "background": "transparent or inherited from page"
}
```

Use this as a local coordinate system. Child `x/y` values below are relative to this frame.

## Layer Order

Figma metadata order:

1. `Architecture` at `x=192.6338, y=0`
2. `Visual Design` at `x=16.1289, y=120`
3. `HCI` at `x=322.4121, y=147`

For web replication, render them in this DOM order or explicitly set z-indexes. The visual result is three overlapping translucent ellipse assets. `Architecture` visually overlaps `Visual Design`; `HCI` is separated on the right.

## Child Layers

### 1. Architecture

```json
{
  "id": "95:126",
  "name": "Architecture",
  "type": "symbol/component instance",
  "x": 192.6337890625,
  "y": 0,
  "width": 149.0364990234375,
  "height": 289.99993896484375,
  "asset": {
    "nodeId": "92:43",
    "src": "architecture.png",
    "placement": "absolute; inset: 0; width: 100%; height: 100%"
  },
  "label": {
    "text": "Architecture",
    "xPercent": 19.03,
    "topPercent": 43.1,
    "fontFamily": "Plus Jakarta Sans",
    "fontSize": 15.584,
    "fontWeight": 400,
    "lineHeight": "normal",
    "color": "#000000",
    "whiteSpace": "nowrap"
  }
}
```

Approximate label placement in CSS:

```css
.architecture-label {
  left: 19.03%;
  top: 43.1%;
}
```

### 2. Visual Design

```json
{
  "id": "95:128",
  "name": "Visual Design",
  "type": "symbol/component instance",
  "x": 16.12890625,
  "y": 120,
  "width": 268.98199462890625,
  "height": 218.1883544921875,
  "asset": {
    "nodeId": "92:34",
    "src": "ellipse-visual-design.png",
    "originalWidth": 235.357,
    "originalHeight": 164.742,
    "rotation": 14.43,
    "placement": "centered inside the 268.982 x 218.188 symbol bounds"
  },
  "label": {
    "text": "Visual Design",
    "leftPercent": 27.46,
    "topPercent": 53.96,
    "fontFamily": "Plus Jakarta Sans",
    "fontSize": 15.584,
    "fontWeight": 400,
    "lineHeight": "normal",
    "color": "#000000",
    "whiteSpace": "nowrap"
  }
}
```

Approximate label placement in CSS:

```css
.visual-label {
  left: 27.46%;
  top: 53.96%;
}
```

### 3. HCI

```json
{
  "id": "95:127",
  "name": "HCI",
  "type": "symbol/component instance",
  "x": 322.412109375,
  "y": 147,
  "width": 264.6598205566406,
  "height": 170.3612823486328,
  "asset": {
    "nodeId": "92:35",
    "src": "ellipse-hci.png",
    "originalWidth": 244.677,
    "originalHeight": 122.783,
    "rotation": -11.84,
    "placement": "centered inside the 264.66 x 170.361 symbol bounds"
  },
  "label": {
    "text": "HCI",
    "leftPercent": 20.25,
    "topPercent": 56.01,
    "fontFamily": "Plus Jakarta Sans",
    "fontSize": 15.584,
    "fontWeight": 400,
    "lineHeight": "normal",
    "color": "#000000",
    "whiteSpace": "nowrap"
  }
}
```

Approximate label placement in CSS:

```css
.hci-label {
  left: 20.25%;
  top: 56.01%;
}
```

## Asset Mapping

The asset files are already included in `figma-implementation/assets/` from the earlier package:

```text
architecture.png
ellipse-visual-design.png
ellipse-hci.png
```

If re-fetching from Figma MCP is needed, the short-lived asset URLs returned during this session were:

```js
const imgEllipse4 = "https://www.figma.com/api/mcp/asset/d118a3aa-90dd-4773-837a-ccd228b179a4";
const imgEllipse5 = "https://www.figma.com/api/mcp/asset/3ceef018-e99c-415d-81a1-ec93a201260a";
const imgArchitecture = "https://www.figma.com/api/mcp/asset/6f37c988-2f47-4d92-8ceb-330be2058adb";
```

Prefer the local files in `assets/`; Figma MCP asset links expire.

## Recommended HTML Structure

```html
<section class="discipline-composition" data-node-id="265:41">
  <div class="discipline architecture" data-node-id="95:126">
    <img src="/assets/architecture.png" alt="" />
    <span>Architecture</span>
  </div>

  <div class="discipline visual-design" data-node-id="95:128">
    <img src="/assets/ellipse-visual-design.png" alt="" />
    <span>Visual Design</span>
  </div>

  <div class="discipline hci" data-node-id="95:127">
    <img src="/assets/ellipse-hci.png" alt="" />
    <span>HCI</span>
  </div>
</section>
```

## Recommended CSS Baseline

```css
.discipline-composition {
  position: relative;
  width: 587.0719px;
  height: 494.3513px;
}

.discipline {
  position: absolute;
}

.discipline img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  display: block;
}

.discipline span {
  position: absolute;
  z-index: 2;
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15.584px;
  font-weight: 400;
  line-height: normal;
  color: #000;
  white-space: nowrap;
}

.architecture {
  left: 192.6338px;
  top: 0;
  width: 149.0365px;
  height: 290px;
}

.architecture span {
  left: 19.03%;
  top: 43.1%;
}

.visual-design {
  left: 16.1289px;
  top: 120px;
  width: 268.982px;
  height: 218.1884px;
}

.visual-design span {
  left: 27.46%;
  top: 53.96%;
}

.hci {
  left: 322.4121px;
  top: 147px;
  width: 264.6598px;
  height: 170.3613px;
}

.hci span {
  left: 20.25%;
  top: 56.01%;
}
```

## Online Codex Prompt

```text
Implement this Figma node in the target codebase:
https://www.figma.com/design/xBgF8kT7suHPjwZnhnbCYc/%E4%B8%AA%E4%BA%BA%E7%AB%99%E8%8D%89%E7%A8%BF?node-id=265-41&m=dev

Use the composition notes in figma-implementation/node-265-41-composition.md.
The node is a 587.0719 x 494.3513 relative frame named “交叉领域示意”.
It contains only three absolute-positioned symbol instances: Architecture, Visual Design, and HCI.
Copy the three assets from figma-implementation/assets/ into the app's static asset directory, then map the CSS values into the repository's existing styling system.
Do not install Tailwind just for this. Preserve the layout, overlap, typography, and node-id data attributes where practical.
```
