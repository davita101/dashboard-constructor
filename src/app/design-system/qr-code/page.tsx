import { QrCode, QrCodeCode } from "@/components/ui/qr-code"

// Mirrors the Figma QR-Code page (9488:542): QR-Code set (15620:540435), Type=Default.

// Deterministic 21x21 placeholder with three finder patterns (Figma ships no code image).
const N = 21
function cell(x: number, y: number) {
  const finder = (fx: number, fy: number) => {
    const dx = x - fx
    const dy = y - fy
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
    const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
    return edge || core
  }
  for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
    const f = finder(fx, fy)
    if (f !== null) return f
  }
  if ((x === 7 || y === 7 || x === N - 8 || y === N - 8) && (x < 8 || y < 8)) return false
  return (x * 7 + y * 13 + x * y) % 3 === 0
}

function PlaceholderCode() {
  const rects: React.ReactNode[] = []
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (cell(x, y)) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="fill-base-900" shapeRendering="crispEdges" role="img" aria-label="QR code">
      {rects}
    </svg>
  )
}

export default function QrCodePreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <section className="flex flex-col gap-6">
        <h2 className="font-default text-14 leading-24 font-bold text-base-800">QR-Code, Type = Default</h2>
        <div className="flex">
          <QrCode>
            <QrCodeCode>
              <PlaceholderCode />
            </QrCodeCode>
          </QrCode>
        </div>
      </section>
    </main>
  )
}
