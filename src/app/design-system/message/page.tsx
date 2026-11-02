import {
  AddMessage,
  ContentMessage,
  ContentMessageAudio,
  ContentMessageCode,
  ContentMessageImages,
  ContentMessageImageText,
  ContentMessageMap,
  ContentMessagePhoto,
  ContentMessageVideo,
  Message,
  MessageActivity,
  MessageBody,
  MessageName,
  MessageTags,
  MessageTyping,
  Reaction,
  ReactionType,
  ReactionsGroup,
  type ReactionEmoji,
} from "@/components/ui/message"

// Mirrors the Figma Messages page (11409:1128).

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-16 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

const group = [
  { emoji: "heart", count: 1 },
  { emoji: "eyes", count: 1 },
  { emoji: "rolling", count: 4 },
  { emoji: "glass", count: 4 },
  { emoji: "angry", count: 4 },
  { emoji: "victory", count: 4 },
  { emoji: "thumbs-up", count: 8 },
  { emoji: "star", count: 8 },
  { emoji: "clapping", count: 9 },
] as { emoji: ReactionEmoji; count: number }[]

const types: ReactionEmoji[] = ["heart", "eyes", "rolling", "sad", "glass", "heart-eyes", "angry", "victory", "thumbs-up", "star", "clapping"]

function Full({ type }: { type: "left" | "right" | "full" }) {
  return (
    <Message type={type}>
      <MessageActivity />
      <MessageBody>
        <MessageName />
        <ContentMessage>Turn on chat features in Messages?</ContentMessage>
        <MessageTags tags={["Tag", "Tag", "Tag"]} />
        <ReactionsGroup reactions={group} />
      </MessageBody>
    </Message>
  )
}

export default function Page() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-10 p-10 font-default">
      <Section title="Content-Message-Component">
        <ContentMessage>Turn on chat features in Messages?</ContentMessage>
        <ContentMessage type="primary">Turn on chat features in Messages?</ContentMessage>
        <ContentMessageAudio />
        <ContentMessageVideo />
        <ContentMessageImageText />
        <ContentMessageImages />
        <ContentMessageCode />
        <ContentMessagePhoto />
        <ContentMessageMap appearance="dark" />
        <ContentMessageMap appearance="light" />
      </Section>
      <Section title="Message">
        <Full type="left" />
        <Full type="right" />
        <Full type="full" />
        <Message type="typing">
          <MessageActivity selectable={false} />
          <MessageTyping />
        </Message>
      </Section>
      <Section title="Add-Message">
        <AddMessage corner="pilled" />
        <AddMessage corner="rounded" />
      </Section>
      <Section title="Reaction-Type-Component">
        {types.map((t) => (
          <ReactionType key={t} type={t} />
        ))}
      </Section>
      <Section title="Reactions-Group-Component">
        <ReactionsGroup reactions={group} className="w-70" />
      </Section>
      <Section title="Reaction-Component">
        <Reaction state="default" />
        <Reaction state="hover" />
        <Reaction state="active" />
        <Reaction type="add" state="default" aria-label="Add" />
        <Reaction type="add" state="hover" aria-label="Add" />
        <Reaction type="add" state="active" aria-label="Add" />
      </Section>
    </main>
  )
}
