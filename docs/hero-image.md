# Landing-page image

The hero uses an AI-assisted background edit of Burger Tree's own Smokey Chick
menu photograph, replacing the tall Shocker photograph and its dark arch frame.
The original menu photography remains unchanged.

- Original: `public/food/p04_018.jpg`
- Final web assets: `public/hero/smokey-chick-v2-{640,1024,1536}.webp`
- Method: built-in image generation/editing tool, followed by Sharp resizing
  and WebP encoding at quality 88. The hero serves responsive local assets.
- Treatment: one product on a warm orange background, with a soft CSS edge
  mask blending the edited background into the exact `#FAA227` page surface.
- The result is an edited promotional image, rather than an untouched photo.

## Prompts

First edit: Extract the complete burger from the supplied photo onto a genuinely
transparent background. Preserve the burger identity, ingredients, proportions,
single smooth unseeded bun, grilled chicken, cheese, sauces, vegetables, textures,
lighting and viewing angle. Remove the café background, table and reflections.
No added ingredients, text, logo, plate, fries, drink, flames or other props.
Center the burger in a landscape 3:2 canvas without cropping.

The first result contained a visible checkerboard, so it was not used on the site.

Final edit: Replace every bit of the white and gray checkerboard background with
a perfectly flat, solid, uniform brand-orange color HEX #FAA227 (RGB 250, 162,
39). Output an opaque RGB image. No checkerboard, pattern, vignette, gradients,
horizon, table or other objects. Keep the burger unchanged: same bun, chicken,
cheese, sauces, vegetables, shape, details, proportions, framing and camera view.
Retain only a subtle contact shadow beneath the burger. Orange should reach every
outside edge. No text, logo, watermark, typography, frame or border. Landscape 3:2.
