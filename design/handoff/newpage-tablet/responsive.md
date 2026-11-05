# Responsive: newpage-tablet

Desktop 1600x1216 (14055:21777), mobile 768x1184 (14055:21899). Positions are relative to the frame. Instances are named, not entered.
Images: img/desktop.png, img/mobile.png (scale 0.5). `[photo]` = layer with an image fill.

## Only on desktop
- New Page ( 1600) (my-choosen)
- Sidebar-01

## Only on mobile
- New Page (768)  (my-choosen)

## Desktop outline (1600)
```
New Page ( 1600) (my-choosen) [frame] 1600x1216 @0,0
  Navigate-01 [instance] 1600x64 @0,0
  Content [frame] 1600x1088 @0,64
    Sidebar-01 [instance] 248x1088 @0,64
    Content [frame] 1352x1088 @248,64
      Content [frame] 1352x1088 @248,64
        Head-Dashboard-01 [instance] 1128x32 @360,112
        Head-Dashboard-02 [instance] 1128x56 @360,176
        Content [frame] 1128x840 @360,264
  Footer [instance] 1600x64 @0,1152
```

## Mobile outline (768)
```
New Page (768)  (my-choosen) [frame] 768x1184 @0,0
  Navigate-01 [instance] 768x64 @0,0
  Content [frame] 768x1056 @0,64
    Head-Dashboard-01 [instance] 696x32 @36,96
    Head-Dashboard-02 [instance] 696x56 @36,160
    Content [frame] 696x840 @36,248
  Footer [instance] 768x64 @0,1120
```
