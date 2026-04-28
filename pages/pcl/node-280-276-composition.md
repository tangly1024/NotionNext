# Figma Node 280:276 Composition Handoff

## Source

Figma URL:
https://www.figma.com/design/xBgF8kT7suHPjwZnhnbCYc/%E4%B8%AA%E4%BA%BA%E7%AB%99%E8%8D%89%E7%A8%BF?node-id=280-276&m=dev

File key: `xBgF8kT7suHPjwZnhnbCYc`
Node ID: `280:276`
Node name: `交叉领域示意`

## Why `280:318` Looked Wrong

`280:318` is only one child image inside this composition:

```text
280:318 = Service Design 2
```

The actual six-image composition is the parent frame:

```text
280:276 = 交叉领域示意
```

Use `280:276` for the full diagram. Ignore the earlier `280:318` handoff.

## Parent Frame

```json
{
  "id": "280:276",
  "name": "交叉领域示意",
  "type": "frame",
  "x": 3456.40966796875,
  "y": 10795.3056640625,
  "width": 587.0718994140625,
  "height": 494.3512878417969,
  "positioning": "relative container; six children are absolutely positioned",
  "background": "transparent/inherited"
}
```

Use this frame as the local coordinate system. All child `x/y` below are relative to this parent.

## Layer Order

Render in this order to match the Figma overlap stack:

1. `Service Design 2` (`280:318`)
2. `UX 1` (`280:320`)
3. `Ixd 1` (`280:316`)
4. `Architecture 1` (`280:324`)
5. `Visual Design 1` (`280:322`)
6. `HCI 1` (`280:314`)

All six children are image-backed rounded rectangles returned by Figma MCP. Each child should be rendered as an absolutely positioned image filling its own bounds.

## Child Image Layers

### 1. Service Design 2

```json
{
  "id": "280:318",
  "name": "Service Design 2",
  "type": "rounded-rectangle",
  "x": -83.704833984375,
  "y": -60.7080078125,
  "width": 661,
  "height": 625,
  "asset": "280-service-design-2.png"
}
```

Notes:

- This layer extends beyond the parent frame on the left and top.
- It contains the large pale ellipse and the `Service Design` label baked into the image.

### 2. UX 1

```json
{
  "id": "280:320",
  "name": "UX 1",
  "type": "rounded-rectangle",
  "x": 103.033203125,
  "y": 95.6962890625,
  "width": 342,
  "height": 343,
  "asset": "280-ux-1.png"
}
```

### 3. Ixd 1

```json
{
  "id": "280:316",
  "name": "Ixd 1",
  "type": "rounded-rectangle",
  "x": 172.7386474609375,
  "y": 152.73863220214844,
  "width": 255,
  "height": 255,
  "asset": "280-ixd-1.png"
}
```

### 4. Architecture 1

```json
{
  "id": "280:324",
  "name": "Architecture 1",
  "type": "rounded-rectangle",
  "x": 192.6337890625,
  "y": 0,
  "width": 150,
  "height": 290,
  "asset": "280-architecture-1.png"
}
```

### 5. Visual Design 1

```json
{
  "id": "280:322",
  "name": "Visual Design 1",
  "type": "rounded-rectangle",
  "x": 16.12890625,
  "y": 120,
  "width": 269,
  "height": 219,
  "asset": "280-visual-design-1.png"
}
```

### 6. HCI 1

```json
{
  "id": "280:314",
  "name": "HCI 1",
  "type": "rounded-rectangle",
  "x": 322.412109375,
  "y": 147,
  "width": 265,
  "height": 171,
  "asset": "280-hci-1.png"
}
```

## Local Asset Files

These files are included in this package:

```text
figma-implementation/assets/280-service-design-2.png
figma-implementation/assets/280-ux-1.png
figma-implementation/assets/280-ixd-1.png
figma-implementation/assets/280-architecture-1.png
figma-implementation/assets/280-visual-design-1.png
figma-implementation/assets/280-hci-1.png
```

Downloaded sizes:

```text
280-service-design-2.png  661 x 625
280-ux-1.png              342 x 343
280-ixd-1.png             255 x 255
280-architecture-1.png    150 x 290
280-visual-design-1.png   269 x 219
280-hci-1.png             265 x 171
```

## Short-Lived Figma MCP Asset URLs

These were the asset URLs returned by Figma MCP. Prefer local files because these URLs expire.

```js
const imgServiceDesign2 = "https://www.figma.com/api/mcp/asset/7442d6d5-db17-4bd2-a3bf-c8ddd9748e17";
const imgUx1 = "https://www.figma.com/api/mcp/asset/8ab9a6e2-b5dc-44c6-81a1-1d22c08a1c12";
const imgIxd1 = "https://www.figma.com/api/mcp/asset/ccd17e9d-7362-4c54-9e81-a6aa87e497ee";
const imgArchitecture1 = "https://www.figma.com/api/mcp/asset/388f01e0-0fcf-4551-84d5-79e79535587a";
const imgVisualDesign1 = "https://www.figma.com/api/mcp/asset/63128d51-8738-4246-b1f4-efc86eb2ef63";
const imgHci1 = "https://www.figma.com/api/mcp/asset/b9a7cb62-55f9-44dd-b831-68ea0c0fbe15";
```

## Recommended HTML Structure

```html
<section class="discipline-diagram" data-node-id="280:276" data-name="交叉领域示意">
  <img class="discipline-layer service-design" src="/assets/280-service-design-2.png" alt="" data-node-id="280:318" />
  <img class="discipline-layer ux" src="/assets/280-ux-1.png" alt="" data-node-id="280:320" />
  <img class="discipline-layer ixd" src="/assets/280-ixd-1.png" alt="" data-node-id="280:316" />
  <img class="discipline-layer architecture" src="/assets/280-architecture-1.png" alt="" data-node-id="280:324" />
  <img class="discipline-layer visual-design" src="/assets/280-visual-design-1.png" alt="" data-node-id="280:322" />
  <img class="discipline-layer hci" src="/assets/280-hci-1.png" alt="" data-node-id="280:314" />
</section>
```

## Recommended CSS Baseline

```css
.discipline-diagram {
  position: relative;
  width: 587.0719px;
  height: 494.3513px;
}

.discipline-layer {
  position: absolute;
  display: block;
  max-width: none;
  object-fit: cover;
  pointer-events: none;
}

.service-design {
  left: -83.7048px;
  top: -60.708px;
  width: 661px;
  height: 625px;
}

.ux {
  left: 103.0332px;
  top: 95.6963px;
  width: 342px;
  height: 343px;
}

.ixd {
  left: 172.7386px;
  top: 152.7386px;
  width: 255px;
  height: 255px;
}

.architecture {
  left: 192.6338px;
  top: 0;
  width: 150px;
  height: 290px;
}

.visual-design {
  left: 16.1289px;
  top: 120px;
  width: 269px;
  height: 219px;
}

.hci {
  left: 322.4121px;
  top: 147px;
  width: 265px;
  height: 171px;
}
```

## Tailwind Mapping Suggestions

If the target project uses Tailwind, arbitrary values are the closest direct mapping:

```tsx
<section className="relative h-[494.3513px] w-[587.0719px]" data-node-id="280:276">
  <img className="pointer-events-none absolute left-[-83.7048px] top-[-60.708px] h-[625px] w-[661px] max-w-none object-cover" src="/assets/280-service-design-2.png" alt="" data-node-id="280:318" />
  <img className="pointer-events-none absolute left-[103.0332px] top-[95.6963px] h-[343px] w-[342px] max-w-none object-cover" src="/assets/280-ux-1.png" alt="" data-node-id="280:320" />
  <img className="pointer-events-none absolute left-[172.7386px] top-[152.7386px] h-[255px] w-[255px] max-w-none object-cover" src="/assets/280-ixd-1.png" alt="" data-node-id="280:316" />
  <img className="pointer-events-none absolute left-[192.6338px] top-0 h-[290px] w-[150px] max-w-none object-cover" src="/assets/280-architecture-1.png" alt="" data-node-id="280:324" />
  <img className="pointer-events-none absolute left-[16.1289px] top-[120px] h-[219px] w-[269px] max-w-none object-cover" src="/assets/280-visual-design-1.png" alt="" data-node-id="280:322" />
  <img className="pointer-events-none absolute left-[322.4121px] top-[147px] h-[171px] w-[265px] max-w-none object-cover" src="/assets/280-hci-1.png" alt="" data-node-id="280:314" />
</section>
```

Do not install Tailwind just for this. If the target codebase does not already use Tailwind, translate these values into the existing styling system.

## Online Codex Prompt

```text
Implement this Figma node in the target codebase:
https://www.figma.com/design/xBgF8kT7suHPjwZnhnbCYc/%E4%B8%AA%E4%BA%BA%E7%AB%99%E8%8D%89%E7%A8%BF?node-id=280-276&m=dev

Use figma-implementation/node-280-276-composition.md as the handoff.
The correct full composition is node 280:276, not node 280:318. Node 280:318 is only the Service Design child image.

Render a 587.0719 x 494.3513 relative container with six absolutely positioned image layers in this order:
Service Design 2, UX 1, Ixd 1, Architecture 1, Visual Design 1, HCI 1.

Copy the six files named 280-*.png from figma-implementation/assets/ into the app's static asset directory.
Map the CSS baseline into the repository's existing framework/styling system.
Do not install Tailwind just for this. Preserve data-node-id attributes where practical.
```
