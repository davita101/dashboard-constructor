import { ActivityContent } from "@/components/activity/ActivityContent"
import { ActivityFeed } from "@/components/activity/ActivityFeed"
import { ActivityFooter } from "@/components/activity/ActivityFooter"
import { ActivityForm } from "@/components/activity/ActivityForm"
import { ActivityIcon, activityTypes, type ActivityType } from "@/components/activity/ActivityIcon"
import { Button } from "@/components/ui/button"

// Mirrors the Figma "🎮 Playground" frame (11715:519024) plus an Activity-Icon variant grid.

const author = "John Traveller"
const time = "2 min ago"
const avatarSrc = "/images/activity/avatar.jpg"

const compactItems: { type: ActivityType; text: string; unread?: boolean }[] = [
  { type: "add", text: "has commented on your video", unread: true },
  { type: "comment", text: "has commented on your video", unread: true },
  { type: "file", text: "Add File" },
  { type: "music", text: "Add File" },
  { type: "image", text: "Add Image in Project" },
  { type: "video", text: "Add Image in Project" },
]

export default function ActivityPreviewPage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-20 bg-background-10 px-4 py-20">
      <div className="flex flex-wrap justify-center gap-24">
        <ol className="flex w-75 flex-col gap-4">
          <li>
            <ActivityFeed
              icon={<ActivityIcon type="add" />}
              author={author}
              time={time}
              text="has commented on your video"
              unread
            >
              <ActivityContent
                type="feed-message"
                text="Great post on UI! It's important to remember that a well-designed UI can have a significant impact on the user experience."
              />
            </ActivityFeed>
          </li>
          <li>
            <ActivityFeed
              icon={<ActivityIcon type="comment" />}
              author={author}
              time={time}
              text="has commented on your video"
              unread
            >
              <ActivityContent
                type="feed-message"
                text="Awesome video! A well-crafted UI truly enhances the overall user experience. Keep up the great work!"
              />
              <ActivityFooter>
                <Button variant="dark" size="micro">
                  Replay
                </Button>
                <Button variant="base-ghost" size="micro">
                  Dismiss
                </Button>
              </ActivityFooter>
            </ActivityFeed>
          </li>
          <li>
            <ActivityFeed icon={<ActivityIcon type="file" />} author={author} time={time} text="Add File">
              <ActivityContent type="file" fileName="File Name" fileSize="24MB" />
            </ActivityFeed>
          </li>
          <li>
            <ActivityFeed icon={<ActivityIcon type="music" />} author={author} time={time} text="Add File">
              <ActivityContent type="player" currentTime="8:58" duration="20:45" />
            </ActivityFeed>
          </li>
          <li>
            <ActivityFeed
              icon={<ActivityIcon type="image" />}
              author={author}
              time={time}
              text="Add Image in Project"
            >
              <ActivityContent type="image" src="/images/activity/image.jpg" alt="Abstract blue planet curves" />
            </ActivityFeed>
          </li>
          <li>
            <ActivityFeed
              icon={<ActivityIcon type="video" />}
              author={author}
              time={time}
              text="Add Image in Project"
            >
              <ActivityContent
                type="video"
                src="/images/activity/video.jpg"
                heading="Video Heading"
                currentTime="1:34"
                remainingTime="-3:40"
              />
            </ActivityFeed>
          </li>
          <li>
            <ActivityForm avatar="left-large" avatarSrc={avatarSrc} name={author} />
          </li>
        </ol>

        <div className="flex flex-col gap-24">
          <ol className="flex w-75 flex-col gap-4">
            {compactItems.map((item) => (
              <li key={item.type}>
                <ActivityFeed
                  icon={<ActivityIcon type={item.type} size="sm" />}
                  author={author}
                  time={time}
                  text={item.text}
                  unread={item.unread}
                />
              </li>
            ))}
            <li>
              <ActivityForm avatar="left-small" avatarSrc={avatarSrc} name={author} />
            </li>
          </ol>

          <ol className="flex w-55 flex-col gap-3">
            {compactItems.map((item) => (
              <li key={item.type}>
                <ActivityFeed
                  icon={<ActivityIcon type={item.type} size="xs" />}
                  author={author}
                  time={time}
                  text={item.text}
                  unread={item.unread}
                />
              </li>
            ))}
            <li>
              <ActivityForm avatar="top" avatarSrc={avatarSrc} name={author} />
            </li>
          </ol>
        </div>
      </div>

      <section aria-label="Activity icon variants" className="flex max-w-full flex-col gap-5 overflow-x-auto">
        {(["soft", "fill"] as const).map((variant) =>
          (["pilled", "rounded"] as const).map((corner) => (
            <div key={`${variant}-${corner}`} className="flex flex-col gap-2">
              {(["default", "sm", "xs"] as const).map((size) => (
                <div key={size} className="flex items-center gap-5">
                  {activityTypes.map((type) => (
                    <span key={type} className="flex w-8 justify-start">
                      <ActivityIcon
                        type={type}
                        variant={variant}
                        corner={corner}
                        size={size}
                        src={avatarSrc}
                        initials="M"
                        alt={author}
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </section>
    </main>
  )
}
