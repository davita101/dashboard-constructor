import { createCn } from "cn/config"

import { fontSizes, radii } from "@/lib/design-tokens"

// Teach cn() the Figma font-size scale so text-16 and text-base-900 don't cancel out,
// and the radius scale so rounded-r20 replaces a component's rounded-xl.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [...fontSizes] }],
      rounded: [{ rounded: [...radii] }],
    },
  },
})
