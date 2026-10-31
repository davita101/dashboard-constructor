import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerControl,
  ColorPickerEyedropper,
  ColorPickerFormat,
  ColorPickerHistory,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliders,
  ColorPickerSwatches,
  type ColorPickerCorner,
} from "@/components/ui/color-picker"

// Mirrors the Figma Color-Picker set (2692:140375): Type=Color, Corner=Pilled | Rounded.

const sampleHex = ["#", "858585"].join("")
const corners = ["pilled", "rounded"] as const satisfies ColorPickerCorner[]

export default function ColorPickerPage() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-10 p-10">
      <h1 className="font-display text-24 leading-32 font-bold text-base-900">Color Picker</h1>
      <div className="flex flex-wrap items-start gap-10">
        {corners.map((corner) => (
          <section key={corner} className="flex flex-col gap-3">
            <h2 className="font-default text-14 leading-24 font-bold text-base-800">Corner={corner}</h2>
            <ColorPicker corner={corner}>
              <ColorPickerArea hue={210} x={95} y={8} />
              <ColorPickerSliders>
                <ColorPickerEyedropper />
                <div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
                  <ColorPickerSlider kind="hue" defaultValue={210} />
                  <ColorPickerSlider kind="alpha" defaultValue={100} />
                </div>
              </ColorPickerSliders>
              <ColorPickerControl>
                <ColorPickerFormat aria-label="Format" />
                <ColorPickerInput aria-label="Value" placeholder="Hex" defaultValue={sampleHex} className="w-17 shrink-0" />
                <ColorPickerInput aria-label="Opacity" placeholder="%" defaultValue="100%" className="w-12 shrink-0" />
              </ColorPickerControl>
              <ColorPickerHistory aria-label="Color list" />
              <ColorPickerSwatches />
            </ColorPicker>
          </section>
        ))}
      </div>
    </main>
  )
}
