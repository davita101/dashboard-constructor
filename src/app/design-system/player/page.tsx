import {
  Player,
  PlayerButton,
  PlayerCenter,
  PlayerControls,
  PlayerFooter,
  PlayerGroup,
  PlayerHead,
  PlayerPlay,
  PlayerProgress,
  PlayerTime,
  PlayerTitle,
} from "@/components/ui/player"

// Mirrors the Figma Player page (9402:22996): Player-Video and Player-Audio.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap gap-6">{children}</div>
    </section>
  )
}

export default function PlayerPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Player-Video">
        <Player variant="video">
          <PlayerHead>
            <PlayerTitle>Video Heading</PlayerTitle>
            <PlayerButton icon="/icons/material-more-horiz-white.svg" aria-label="More" />
          </PlayerHead>
          <PlayerCenter>
            <PlayerPlay />
          </PlayerCenter>
          <PlayerFooter>
            <PlayerProgress value={100} aria-label="Progress" />
            <PlayerControls>
              <PlayerGroup>
                <PlayerButton icon="/icons/material-play-arrow.svg" aria-label="Play" />
                <PlayerButton icon="/icons/material-skip-next.svg" aria-label="Next" />
                <PlayerButton icon="/icons/material-volume-up.svg" aria-label="Volume" />
                <PlayerTime>8:58 / 20:45</PlayerTime>
              </PlayerGroup>
              <PlayerGroup>
                <PlayerButton icon="/icons/material-subtitles.svg" aria-label="Subtitles" />
                <PlayerButton icon="/icons/material-settings.svg" aria-label="Settings" />
                <PlayerButton icon="/icons/material-fullscreen.svg" aria-label="Fullscreen" />
              </PlayerGroup>
            </PlayerControls>
          </PlayerFooter>
        </Player>
      </Section>
      <Section title="Player-Audio">
        <Player variant="audio">
          <PlayerControls className="gap-2">
            <PlayerGroup className="gap-1">
              <PlayerButton icon="/icons/material-play-arrow.svg" aria-label="Play" />
              <PlayerTime>8:58 / 20:45</PlayerTime>
            </PlayerGroup>
            <PlayerProgress value={100} color="blue" aria-label="Progress" className="flex-1" />
            <PlayerButton icon="/icons/material-volume-up.svg" aria-label="Volume" />
          </PlayerControls>
        </Player>
      </Section>
    </main>
  )
}
