# Responsive: newpage

Desktop 1600x1216 (14055:21777), mobile 360x1390 (14055:21845). Positions are relative to the frame. Instances are named, not entered.
Images: img/desktop.png, img/mobile.png (scale 0.5). `[photo]` = layer with an image fill.

## Only on desktop
- New Page ( 1600) (my-choosen)
- Sidebar-01

## Only on mobile
- New Page (360)  (my-choosen)

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

## Mobile outline (360)
```
New Page (360)  (my-choosen) [frame] 360x1390 @0,0
  Navigate-01 [instance] 360x64 @0,0
  Content [frame] 360x282 @0,64
    Head-Dashboard-01 [instance] 320x66 @20,84
    Head-Dashboard-02 [instance] 320x152 @20,174
  Content [frame] 360x840 @0,346
  Footer [instance] 360x204 @0,1186
```
