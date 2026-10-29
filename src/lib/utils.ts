import { createCn } from "cn/config"

import { fontSizes } from "@/lib/design-tokens"

// Teach cn() the Figma font-size scale so text-16 and text-base-900 don't cancel out.
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [...fontSizes] }] } },
})
