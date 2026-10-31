import { List, ListIcon, ListItem, ListText } from "@/components/ui/list"

// Mirrors the Figma List page (11654:127): List-Item (State) and List (Size).

const states = ["default", "hover", "active"] as const
const sizes = ["12", "11", "10"] as const

export default function ListPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <section className="flex flex-col gap-6">
        <h2 className="font-default text-14 leading-24 font-bold text-base-800">List-Item</h2>
        <div className="flex flex-col items-start gap-4">
          {states.map((state) => (
            <ListItem key={state} state={state}>
              <ListIcon />
              <ListText>Text Item</ListText>
            </ListItem>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="font-default text-14 leading-24 font-bold text-base-800">List</h2>
        <div className="flex flex-col items-start gap-4">
          {sizes.map((size) => (
            <List key={size} size={size}>
              <ListIcon />
              <ListText>Text Item</ListText>
              <ListIcon />
            </List>
          ))}
        </div>
      </section>
    </main>
  )
}
