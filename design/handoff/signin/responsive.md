# Responsive: signin

Desktop 1600x1056 (14056:126280), mobile 360x756 (14056:126336). Positions are relative to the frame. Instances are named, not entered.
Images: img/desktop.png, img/mobile.png (scale 0.5). `[photo]` = layer with an image fill.

## Only on desktop
- Sing In ( 1600)
- Sign-In-01
- Image
- New Features
- Group
- Metric-Column-Chart-Card
- Metric-Line-Chart-Card
- Metric-Progress-Chart-Card
- Carousel-Dot-Group-Component

## Only on mobile
- Sing In (360)
- Navigate-01
- Sign-In-02
- Footer

## Desktop outline (1600)
```
Sing In ( 1600) [frame] 1600x1056 @0,0
  Content [frame] 1600x1056 @0,0
    Content [frame] 764x1008 @24,24
      Content [frame] 360x608 @226,224
        Sign-In-01 [instance] 280x528 @266,264
    Image [frame] 764x1008 @812,24 [photo]
      New Features [text] 160x36 @932,252 "New Features" 24/36
      Group [frame] 524x352 @932,368
        Metric-Column-Chart-Card [instance] 250x164 @932,368
        Metric-Line-Chart-Card [instance] 250x164 @1206,368
        Metric-Progress-Chart-Card [instance] 250x164 @932,556
        Metric-Progress-Chart-Card [instance] 250x164 @1206,556
      Carousel-Dot-Group-Component [instance] 252x4 @932,800
```

## Mobile outline (360)
```
Sing In (360) [frame] 360x756 @0,0
  Navigate-01 [instance] 360x64 @0,0
  Content [frame] 360x488 @0,64
    Sign-In-02 [instance] 280x408 @40,104
  Footer [instance] 360x204 @0,552
```
