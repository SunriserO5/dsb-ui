import icon from "../../assets/icon.png";

import caerulaFrame from "../../assets/caerulaarbor/bg.20ca55.jpg";
import caerulaBg1 from "../../assets/caerulaarbor/bg1.jpg";
import caerulaBgSoft from "../../assets/caerulaarbor/bg2.jpg";
import caerulaFrontpage from "../../assets/caerulaarbor/frontpage.jpg";
import caerulaPause from "../../assets/caerulaarbor/pause.jpg";

import crimsonBackdrop from "../../assets/crimsonsolitaire/bg.adfcdd.jpg";
import crimsonBg from "../../assets/crimsonsolitaire/bg.990471.jpg";
import crimsonStandby from "../../assets/crimsonsolitaire/bg.5ac4f6.jpg";
import crimsonMark from "../../assets/crimsonsolitaire/crimson-solitaire.51b187.png";
import crimsonTitle from "../../assets/crimsonsolitaire/title.aae4d2.png";

import furnaceArch from "../../assets/furnacesidefables/arch-bridge.2dc169.png";
import furnaceBg from "../../assets/furnacesidefables/bg.66401b.jpg";
import furnaceButtonActive from "../../assets/furnacesidefables/button-active.55fd9b.png";
import furnaceContentBg from "../../assets/furnacesidefables/content-bg.61c9a5.png";
import furnacePartTitle from "../../assets/furnacesidefables/part-title-bg.01b8dc.png";
import furnaceStandby from "../../assets/furnacesidefables/pv-bg.52cb31.jpg";
import furnaceMark from "../../assets/furnacesidefables/mark.7727ba.png";
import furnaceTitle from "../../assets/furnacesidefables/title.2c27a1.png";

import gardenButtonBg from "../../assets/gardenofgrotesqueries/button-bg.a84eff.png";
import gardenBg from "../../assets/gardenofgrotesqueries/bg.478d29.jpg";
import gardenDecorBg from "../../assets/gardenofgrotesqueries/bg.ad32fd.png";
import gardenProgressBg from "../../assets/gardenofgrotesqueries/progress-bg.634a70.png";
import gardenStandby from "../../assets/gardenofgrotesqueries/bg.6c9099.jpg";
import gardenMark from "../../assets/gardenofgrotesqueries/ticket.acdd7e.webp";
import gardenTitle from "../../assets/gardenofgrotesqueries/title.66087b.png";

import samiPartTitle from "../../assets/samiexpedition/part-title-bg.a2eb74.png";
import samiBg from "../../assets/samiexpedition/bg.707eee.jpg";
import samiDecorBg from "../../assets/samiexpedition/bg.88345e.jpg";
import samiStandby from "../../assets/samiexpedition/bg.018471.jpg";
import samiMark from "../../assets/samiexpedition/progress-front.1a37e2.png";
import samiTitle from "../../assets/samiexpedition/title.38ab76.png";

import type { ThemeId } from "../types";

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  shortName: string;
  className: string;
  liveBackground: string;
  standbyBackground: string;
  mark: string;
  standbyTitle?: string;
  liveDecor?: string;
  standbyDecor?: string;
  panelTexture?: string;
  lowerTexture?: string;
  accentOrnament?: string;
  accent: string;
  accentSoft: string;
  line: string;
  panel: string;
  panelDeep: string;
  gold: string;
  displayFont: string;
};

export const themes: Record<ThemeId, ThemeDefinition> = {
  caerulaarbor: {
    id: "caerulaarbor",
    name: "水月",
    shortName: "水月",
    className: "theme-caerulaarbor",
    liveBackground: caerulaBgSoft,
    standbyBackground: caerulaPause,
    mark: icon,
    liveDecor: caerulaFrame,
    standbyDecor: caerulaFrontpage,
    panelTexture: caerulaBg1,
    lowerTexture: caerulaFrame,
    accentOrnament: icon,
    accent: "#42f1f2",
    accentSoft: "rgba(66, 241, 242, 0.22)",
    line: "rgba(165, 245, 248, 0.5)",
    panel: "rgba(11, 44, 53, 0.82)",
    panelDeep: "rgba(2, 12, 16, 0.88)",
    gold: "#e0d4b6",
    displayFont: '"Age Caerula", "Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif',
  },
  crimsonsolitaire: {
    id: "crimsonsolitaire",
    name: "傀影",
    shortName: "傀影",
    className: "theme-crimsonsolitaire",
    liveBackground: crimsonBg,
    standbyBackground: crimsonStandby,
    mark: crimsonMark,
    standbyTitle: crimsonTitle,
    liveDecor: crimsonBackdrop,
    standbyDecor: crimsonBackdrop,
    panelTexture: crimsonBackdrop,
    lowerTexture: crimsonBackdrop,
    accentOrnament: crimsonMark,
    accent: "#ff4b5f",
    accentSoft: "rgba(255, 75, 95, 0.24)",
    line: "rgba(255, 187, 139, 0.55)",
    panel: "rgba(61, 12, 22, 0.82)",
    panelDeep: "rgba(13, 6, 10, 0.9)",
    gold: "#f5c88b",
    displayFont: '"Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif',
  },
  furnacesidefables: {
    id: "furnacesidefables",
    name: "萨卡兹",
    shortName: "萨卡兹",
    className: "theme-furnacesidefables",
    liveBackground: furnaceBg,
    standbyBackground: furnaceStandby,
    mark: furnaceMark,
    standbyTitle: furnaceTitle,
    liveDecor: furnaceArch,
    standbyDecor: furnaceContentBg,
    panelTexture: furnaceContentBg,
    lowerTexture: furnacePartTitle,
    accentOrnament: furnaceButtonActive,
    accent: "#ffd15a",
    accentSoft: "rgba(255, 209, 90, 0.22)",
    line: "rgba(255, 223, 151, 0.52)",
    panel: "rgba(48, 31, 20, 0.82)",
    panelDeep: "rgba(11, 12, 11, 0.9)",
    gold: "#ffe6a6",
    displayFont: '"Endfield Butan", "Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif',
  },
  gardenofgrotesqueries: {
    id: "gardenofgrotesqueries",
    name: "界园",
    shortName: "界园",
    className: "theme-gardenofgrotesqueries",
    liveBackground: gardenBg,
    standbyBackground: gardenStandby,
    mark: gardenMark,
    standbyTitle: gardenTitle,
    liveDecor: gardenDecorBg,
    standbyDecor: gardenProgressBg,
    panelTexture: gardenButtonBg,
    lowerTexture: gardenProgressBg,
    accentOrnament: gardenMark,
    accent: "#e66ca6",
    accentSoft: "rgba(230, 108, 166, 0.22)",
    line: "rgba(186, 237, 160, 0.52)",
    panel: "rgba(22, 45, 34, 0.82)",
    panelDeep: "rgba(8, 12, 10, 0.92)",
    gold: "#cfe59b",
    displayFont: '"Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif',
  },
  samiexpedition: {
    id: "samiexpedition",
    name: "萨米",
    shortName: "萨米",
    className: "theme-samiexpedition",
    liveBackground: samiBg,
    standbyBackground: samiStandby,
    mark: samiMark,
    standbyTitle: samiTitle,
    liveDecor: samiDecorBg,
    standbyDecor: samiPartTitle,
    panelTexture: samiPartTitle,
    lowerTexture: samiPartTitle,
    accentOrnament: samiMark,
    accent: "#bcecff",
    accentSoft: "rgba(188, 236, 255, 0.22)",
    line: "rgba(224, 247, 255, 0.58)",
    panel: "rgba(20, 45, 58, 0.78)",
    panelDeep: "rgba(5, 12, 18, 0.9)",
    gold: "#f4fbff",
    displayFont: '"Far North Runes", "Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif',
  },
};

export const themeList = Object.values(themes);

export function getTheme(themeId: ThemeId | string | undefined) {
  return themes[themeId as ThemeId] ?? themes.caerulaarbor;
}

export const caerulaAssets = {
  icon,
  bgFrame: caerulaFrame,
  bgSoft: caerulaBgSoft,
  frontpage: caerulaFrontpage,
  pause: caerulaPause,
};
