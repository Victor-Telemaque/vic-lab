export type CloudDepth = 'far' | 'back' | 'mid' | 'near' | 'edge';

export type CloudPathDef = {
  d: string;
  colorVar: string;
  fadeFrom?: number;
};

export type CloudLayerDef = {
  id: string;
  depth: CloudDepth;
  viewBox: string;
  paths: CloudPathDef[];
};

export const siteCloudLayers: CloudLayerDef[] = [
  {
    id: 'cloud-far',
    depth: 'far',
    viewBox: '0 0 1200 260',
    paths: [
      {
        d: 'M0 168C140 128 260 108 400 124C520 88 660 96 780 128C900 96 1040 108 1200 136V260H0V168Z',
        colorVar: '--site-cloud-far',
        fadeFrom: 80,
      },
      {
        d: 'M0 198C180 162 320 148 480 158C620 132 760 140 920 162C1040 148 1120 156 1200 168V260H0V198Z',
        colorVar: '--site-cloud-far',
        fadeFrom: 86,
      },
    ],
  },
  {
    id: 'cloud-back',
    depth: 'back',
    viewBox: '0 0 1200 220',
    paths: [
      {
        d: 'M0 140C80 108 140 92 220 98C280 62 360 48 450 72C520 42 610 58 680 88C760 52 860 44 960 78C1040 58 1120 72 1200 96V220H0V140Z',
        colorVar: '--site-cloud-a',
        fadeFrom: 78,
      },
      {
        d: 'M0 168C120 132 210 118 320 128C400 98 500 108 590 138C680 108 790 98 900 124C1000 108 1100 118 1200 142V220H0V168Z',
        colorVar: '--site-cloud-b',
        fadeFrom: 84,
      },
    ],
  },
  {
    id: 'cloud-mid',
    depth: 'mid',
    viewBox: '0 0 1200 200',
    paths: [
      {
        d: 'M0 120C100 88 180 72 290 84C380 56 490 64 580 92C670 68 780 60 890 86C980 72 1090 82 1200 104V200H0V120Z',
        colorVar: '--site-cloud-c',
        fadeFrom: 82,
      },
      {
        d: 'M0 148C90 118 200 102 340 112C440 88 560 94 680 118C780 98 900 104 1020 126C1100 116 1160 122 1200 128V200H0V148Z',
        colorVar: '--site-cloud-d',
        fadeFrom: 86,
      },
    ],
  },
  {
    id: 'cloud-near',
    depth: 'near',
    viewBox: '0 0 1200 180',
    paths: [
      {
        d: 'M0 96C70 68 160 52 280 64C360 42 470 48 560 74C650 50 760 44 870 70C960 56 1080 62 1200 78V180H0V96Z',
        colorVar: '--site-cloud-near',
        fadeFrom: 76,
      },
      {
        d: 'M0 124C110 98 220 86 350 94C450 74 570 80 690 102C790 86 910 90 1030 108C1100 100 1160 104 1200 108V180H0V124Z',
        colorVar: '--site-cloud-a',
        fadeFrom: 82,
      },
    ],
  },
  {
    id: 'cloud-edge',
    depth: 'edge',
    viewBox: '0 0 1200 160',
    paths: [
      {
        d: 'M0 82C80 58 170 46 290 56C380 38 490 42 590 66C680 48 790 44 900 62C990 52 1090 56 1200 68V160H0V82Z',
        colorVar: '--site-cloud-edge',
        fadeFrom: 68,
      },
    ],
  },
];
