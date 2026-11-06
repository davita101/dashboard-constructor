# Responsive: widget-grid

Desktop 1600x1636 (14055:68554), mobile 360x3390 (14055:69334). Positions are relative to the frame. Instances are named, not entered.
Images: img/desktop.png, img/mobile.png (scale 0.5). `[photo]` = layer with an image fill.

## Only on desktop
- Main (1600)  current section
- Sidebar-01
- Metric-Column-Chart-Card
- Metric-Line-Chart-Card
- Metric-Progress-Chart-Card
- Column-Type-3-Chart-Card
- Donut-Chart-Card
- Line-Area-Chart-Card

## Only on mobile
- Main (360)
- Metric-Card
- Progress-Half-Chart-Card
- Column-Type-6-Chart-Card
- Progress-Chart-Card
- Table
- Checkbox-Cell
- Text-Cell
- Image-Cell
- Scroll

## Desktop outline (1600)
```
Main (1600)  current section [frame] 1600x1636 @0,0
  Content [frame] 1600x1636 @0,0
    Sidebar-01 [instance] 248x1636 @0,0
    Content [frame] 1352x1636 @248,0
      Navigate-01 [instance] 1352x64 @248,0
      Content [frame] 1352x1508 @248,64
        Head-Dashboard-01 [instance] 1128x32 @360,112
        Head-Dashboard-03 [instance] 1128x52 @360,168
        Content [frame] 1128x1280 @360,244
          Group [frame] 1128x164 @360,244
            Metric-Column-Chart-Card [instance] 264x164 @360,244
            Metric-Line-Chart-Card [instance] 264x164 @648,244
            Metric-Progress-Chart-Card [instance] 264x164 @936,244
            Metric-Progress-Chart-Card [instance] 264x164 @1224,244
          Group [frame] 1128x540 @360,432
            Column [frame] 264x540 @360,432
            Column-Type-3-Chart-Card [instance] 408x540 @648,432
            Donut-Chart-Card [instance] 408x540 @1080,432
          Line-Area-Chart-Card [instance] 1128x528 @360,996
      Footer [instance] 1352x64 @248,1572
```

## Mobile outline (360)
```
Main (360) [frame] 360x3390 @0,0
  Navigate-01 [instance] 360x64 @0,0
  Content [frame] 360x3122 @0,64
    Head-Dashboard-01 [instance] 320x66 @20,84
    Head-Dashboard-03 [instance] 320x196 @20,174
    Group [frame] 320x868 @20,394
      Metric-Card [instance] 320x164 @20,394
      Metric-Card [instance] 320x164 @20,570
      Metric-Card [instance] 320x164 @20,746
      Metric-Card [instance] 320x164 @20,922
      Metric-Card [instance] 320x164 @20,1098
    Progress-Half-Chart-Card [instance] 320x504 @20,1286
    Column-Type-6-Chart-Card [instance] 320x528 @20,1814
    Progress-Chart-Card [instance] 320x508 @20,2366
    Content [frame] 320x240 @20,2898
      Table [frame] 1018x240 @20,2898
        Column [frame] 50x240 @20,2898
          Checkbox-Cell [instance] 50x40 @20,2898
          Checkbox-Cell [instance] 50x40 @20,2938
          Checkbox-Cell [instance] 50x40 @20,2978
          Checkbox-Cell [instance] 50x40 @20,3018
          Checkbox-Cell [instance] 50x40 @20,3058
          Checkbox-Cell [instance] 50x40 @20,3098
        Column [frame] 338x240 @70,2898
          Text-Cell [instance] 338x40 @70,2898
          Image-Cell [instance] 338x40 @70,2938
          Image-Cell [instance] 338x40 @70,2978
          Image-Cell [instance] 338x40 @70,3018
          Image-Cell [instance] 338x40 @70,3058
          Image-Cell [instance] 338x40 @70,3098
        Column [frame] 130x240 @408,2898
          Text-Cell [instance] 130x40 @408,2898
          Text-Cell [instance] 130x40 @408,2938
          Text-Cell [instance] 130x40 @408,2978
          Text-Cell [instance] 130x40 @408,3018
          Text-Cell [instance] 130x40 @408,3058
          Text-Cell [instance] 130x40 @408,3098
        Column [frame] 140x240 @538,2898
          Text-Cell [instance] 140x40 @538,2898
          Text-Cell [instance] 140x40 @538,2938
          Text-Cell [instance] 140x40 @538,2978
          Text-Cell [instance] 140x40 @538,3018
          Text-Cell [instance] 140x40 @538,3058
          Text-Cell [instance] 140x40 @538,3098
        Column [frame] 140x240 @678,2898
          Text-Cell [instance] 140x40 @678,2898
          Text-Cell [instance] 140x40 @678,2938
          Text-Cell [instance] 140x40 @678,2978
          Text-Cell [instance] 140x40 @678,3018
          Text-Cell [instance] 140x40 @678,3058
          Text-Cell [instance] 140x40 @678,3098
        Column [frame] 100x240 @818,2898
          Text-Cell [instance] 100x40 @818,2898
          Text-Cell [instance] 100x40 @818,2938
          Text-Cell [instance] 100x40 @818,2978
          Text-Cell [instance] 100x40 @818,3018
          Text-Cell [instance] 100x40 @818,3058
          Text-Cell [instance] 100x40 @818,3098
        Column [frame] 120x240 @918,2898
          Text-Cell [instance] 120x40 @918,2898
          Text-Cell [instance] 120x40 @918,2938
          Text-Cell [instance] 120x40 @918,2978
          Text-Cell [instance] 120x40 @918,3018
          Text-Cell [instance] 120x40 @918,3058
          Text-Cell [instance] 120x40 @918,3098
    Scroll [instance] 256x4 @20,3162
  Footer [instance] 360x204 @0,3186
```
