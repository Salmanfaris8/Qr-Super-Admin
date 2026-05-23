import type { ComponentType } from "react";
import Template1 from "../Templates/Template1";
import Template2 from "../Templates/Template2";
import Template3 from "../Templates/Template3";
import Template4 from "../Templates/Template4";
import Template5 from "../Templates/Template5";
import Template6 from "../Templates/Template6";
import Template7 from "../Templates/Template7";
import Template8 from "../Templates/Template8";
import {
  cloneConfig,
  DEFAULT_TEMPLATE1_CONFIG,
  DEFAULT_TEMPLATE2_CONFIG,
  DEFAULT_TEMPLATE3_CONFIG,
  DEFAULT_TEMPLATE4_CONFIG,
  DEFAULT_TEMPLATE5_CONFIG,
  DEFAULT_TEMPLATE6_CONFIG,
  DEFAULT_TEMPLATE7_CONFIG,
  DEFAULT_TEMPLATE8_CONFIG,
  type TemplateConfig,
  type TemplateType,
} from "../pages/Templateconfig";

export type TemplateComponent = ComponentType<{ config?: TemplateConfig }>;

export interface ThemeRecord {
  id?: string;
  name?: string;
  tier?: string;
  templateId?: string;
  templateType?: string;
  catalogId?: string;
  catalogThemeId?: string;
  config?: TemplateConfig | string | null;
  templateConfig?: TemplateConfig | string | null;
  [key: string]: unknown;
}

const TEMPLATE_IDS: TemplateType[] = Array.from(
  { length: 20 },
  (_, i) => `template${i + 1}` as TemplateType
);

function resolveComponent(id: TemplateType): TemplateComponent {
  if (id === "template3") return Template3;
  if (id === "template4") return Template4;
  if (id === "template5") return Template5;
  if (id === "template6") return Template6;
  if (id === "template7") return Template7;
  if (id === "template8") return Template8;
  const num = parseInt(id.replace(/\D/g, ""), 10);
  return num % 2 === 0 ? Template2 : Template1;
}

const TEMPLATE_COMPONENTS: Record<TemplateType, TemplateComponent> = TEMPLATE_IDS.reduce(
  (acc, id) => {
    acc[id] = resolveComponent(id);
    return acc;
  },
  {} as Record<TemplateType, TemplateComponent>
);

function resolveDefaultConfig(id: TemplateType): TemplateConfig {
  if (id === "template3") return { ...DEFAULT_TEMPLATE3_CONFIG, id: `${id}-default`, templateType: id };
  if (id === "template4") return { ...DEFAULT_TEMPLATE4_CONFIG, id: `${id}-default`, templateType: id };
  if (id === "template5") return { ...DEFAULT_TEMPLATE5_CONFIG, id: `${id}-default`, templateType: id };
  if (id === "template6") return { ...DEFAULT_TEMPLATE6_CONFIG, id: `${id}-default`, templateType: id };
  if (id === "template7") return { ...DEFAULT_TEMPLATE7_CONFIG, id: `${id}-default`, templateType: id };
  if (id === "template8") return { ...DEFAULT_TEMPLATE8_CONFIG, id: `${id}-default`, templateType: id };
  const num = parseInt(id.replace(/\D/g, ""), 10);
  const base = num % 2 === 0 ? DEFAULT_TEMPLATE2_CONFIG : DEFAULT_TEMPLATE1_CONFIG;
  return { ...base, id: `${id}-default`, templateType: id };
}

const DEFAULT_CONFIGS: Record<TemplateType, TemplateConfig> = TEMPLATE_IDS.reduce(
  (acc, id) => {
    acc[id] = resolveDefaultConfig(id);
    return acc;
  },
  {} as Record<TemplateType, TemplateConfig>
);

function normalizeTemplateId(value: unknown): TemplateType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase().replace(/[\s_-]+/g, "");
  return TEMPLATE_IDS.find((id) => normalized === id) ?? null;
}

function parseConfig(value: unknown): TemplateConfig | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as TemplateConfig;
    } catch {
      return null;
    }
  }
  return value as TemplateConfig;
}

function getDefaultConfig(catalogId: TemplateType): TemplateConfig {
  return cloneConfig(DEFAULT_CONFIGS[catalogId]);
}

export function getTemplateComponentByCatalogId(catalogId: string): TemplateComponent {
  const templateId = normalizeTemplateId(catalogId) ?? "template1";
  return TEMPLATE_COMPONENTS[templateId];
}

export function inferCatalogThemeId(theme: ThemeRecord, themes: ThemeRecord[] = []): TemplateType {
  // 1. Explicit fields on the theme record itself
  const directId =
    normalizeTemplateId(theme.templateType) ??
    normalizeTemplateId(theme.templateId) ??
    normalizeTemplateId(theme.catalogId) ??
    normalizeTemplateId(theme.catalogThemeId);

  if (directId) return directId;

  // 2. Look inside the stored config object
  const config = parseConfig(theme.config) ?? parseConfig(theme.templateConfig);
  const configTemplateId = normalizeTemplateId(config?.templateType);
  if (configTemplateId) return configTemplateId;

  // 3. Name-based heuristics
  const searchableName = String(theme.name ?? "").toLowerCase();

  const nameNumMatch = searchableName.match(/template\s*(\d+)/i);
  if (nameNumMatch) {
    const matchedId = `template${nameNumMatch[1]}` as TemplateType;
    if (TEMPLATE_IDS.includes(matchedId)) return matchedId;
  }

  if (searchableName.includes("dark")) return "template2";
  if (
    searchableName.includes("coffee") ||
    searchableName.includes("cafe") ||
    searchableName.includes("rimberio") ||
    searchableName.includes("template 3")
  ) return "template3";
  if (
    searchableName.includes("burger") ||
    searchableName.includes("fauget burger") ||
    searchableName.includes("template 4")
  ) return "template4";
  if (
    searchableName.includes("fauget hotel") ||
    searchableName.includes("golden hotel") ||
    searchableName.includes("hotel golden") ||
    searchableName.includes("template 5")
  ) return "template5";
  if (
    searchableName.includes("restaurant food menu") ||
    searchableName.includes("food menu") ||
    searchableName.includes("burgundy") ||
    searchableName.includes("template 6")
  ) return "template6";
  if (
    searchableName.includes("elegant light") ||
    searchableName.includes("light menu") ||
    searchableName.includes("elegant menu") ||
    searchableName.includes("template 7")
  ) return "template7";
  if (
    searchableName.includes("gourmet forest") ||
    searchableName.includes("forest green") ||
    searchableName.includes("terracotta") ||
    searchableName.includes("template 8") ||
    searchableName.includes("template8")
  ) return "template8";
  if (searchableName.includes("luxury")) return "template3";

  // 4. Position-based fallback (index in the list)
  const themeIndex = theme.id ? themes.findIndex((item) => item.id === theme.id) : -1;
  if (themeIndex >= 0) return TEMPLATE_IDS[themeIndex % TEMPLATE_IDS.length];

  return "template1";
}

export function ensureConfigForCatalog(catalogId: string, config: TemplateConfig): TemplateConfig {
  const templateId =
    normalizeTemplateId(catalogId) ?? normalizeTemplateId(config.templateType) ?? "template1";
  const baseConfig = getDefaultConfig(templateId);

  return {
    ...baseConfig,
    ...config,
    templateType: templateId,
    spacing: {
      ...baseConfig.spacing,
      ...config.spacing,
    },
    layout: {
      ...baseConfig.layout,
      ...config.layout,
    },
    headerSection: {
      ...baseConfig.headerSection,
      ...config.headerSection,
      typography: {
        ...baseConfig.headerSection?.typography,
        ...config.headerSection?.typography,
      },
    },
    menuSection: {
      ...baseConfig.menuSection,
      ...config.menuSection,
      layout: {
        ...baseConfig.menuSection?.layout,
        ...config.menuSection?.layout,
      },
      typography: {
        ...baseConfig.menuSection?.typography,
        ...config.menuSection?.typography,
      },
    },
    footer: {
      ...baseConfig.footer,
      ...config.footer,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function resolveMenuThemeConfig(
  theme: ThemeRecord,
  themes: ThemeRecord[] = [],
  savedConfig?: TemplateConfig
): TemplateConfig {
  const catalogId = inferCatalogThemeId(theme, themes);
  const apiConfig = parseConfig(theme.config) ?? parseConfig(theme.templateConfig);
  const config = savedConfig ?? apiConfig ?? getDefaultConfig(catalogId);

  return ensureConfigForCatalog(catalogId, config);
}