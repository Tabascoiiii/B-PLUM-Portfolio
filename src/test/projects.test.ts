import { describe, expect, it } from "vitest";
import { getAdjacentProjects, getProject, getProjectLocale, projects } from "../data/projects";

describe("project content", () => {
  const caseStudySectionIds = ["context", "contribution", "decisions", "implementation", "outcome"];

  it("keeps the four real projects in the intended order", () => {
    expect(projects.filter((project) => project.featured).map((project) => project.slug)).toEqual([
      "cat-time-companion",
      "fusheng-records",
      "easy-cat-minesweeper",
      "plum-b",
    ]);
  });

  it("publishes Desktop Time Companion support details without exposing its private repository", () => {
    const project = getProject("cat-time-companion");

    expect(project?.platform).toBe("macOS 13+");
    expect(project?.status).toBe("release-preparation");
    expect(project?.technologies).toEqual(["Swift", "AppKit", "SwiftUI", "StoreKit 2"]);
    expect(project?.coverImage.fit).toBe("contain");
    expect(project?.supportUrl).toBe("https://b-plum.com/cat-time-companion/support/");
    expect(project?.privacyPolicyUrl).toBe("https://b-plum.com/cat-time-companion/privacy/");
    expect(project?.repositoryUrl).toBeUndefined();
  });

  it("uses the shared case study structure for every project", () => {
    for (const project of projects) {
      expect(getProjectLocale(project, "en").sections.map((section) => section.id)).toEqual(caseStudySectionIds);
      expect(getProjectLocale(project, "en").sections.map((section) => section.title)).toEqual([
        "Context & goal",
        "My contribution",
        "Experience & decisions",
        "Implementation",
        "Outcome & learnings",
      ]);
      expect(getProjectLocale(project, "en").sections.find((section) => section.id === "contribution")?.content).toMatch(/^I /);
      expect(Object.keys(project.locales).sort()).toEqual(["en", "ja", "zh"]);
      expect(getProjectLocale(project, "ja").sections.map((section) => section.id)).toEqual(caseStudySectionIds);
      expect(getProjectLocale(project, "zh").sections.map((section) => section.id)).toEqual(caseStudySectionIds);
    }
  });

  it("resolves Fusheng Records with three locales and two supporting gallery frames", () => {
    const project = getProject("fusheng-records");

    expect(project?.locales.en.title).toBe("B-PLUM-FushengRecords");
    expect(project?.locales.ja.category).toBe("エージェントスキルプラグイン");
    expect(project?.locales.zh.category).toBe("智能体技能插件");
    expect(project?.gallery).toHaveLength(2);
    expect(project?.repositoryUrl).toBe("https://github.com/Tabascoiiii/B-PLUM-FushengRecords");
  });

  it("resolves B-PLUM-Ask with two supporting gallery frames", () => {
    expect(getProject("plum-b")?.locales.en.title).toBe("B-PLUM-Ask");
    expect(getProject("plum-b")?.gallery).toHaveLength(2);
  });

  it("preserves project-specific technical terms in the rewritten English and Japanese copy", () => {
    const localizedContent = (slug: string, locale: "en" | "ja") => getProject(slug)?.locales[locale].sections.map((section) => section.content).join(" ") ?? "";

    for (const locale of ["en", "ja"] as const) {
      expect(localizedContent("cat-time-companion", locale)).toContain("AppKit");
      expect(localizedContent("cat-time-companion", locale)).toContain("SwiftUI");
      expect(localizedContent("cat-time-companion", locale)).toContain("StoreKit 2");
      expect(localizedContent("fusheng-records", locale)).toContain("Skill");
      expect(localizedContent("fusheng-records", locale)).toContain("`出票`");
      expect(localizedContent("fusheng-records", locale)).toContain("PNG/JSON");
      expect(localizedContent("fusheng-records", locale)).toContain("IndexedDB");
      expect(localizedContent("easy-cat-minesweeper", locale)).toContain("`Minesweeper_Win`");
      expect(localizedContent("easy-cat-minesweeper", locale)).toContain("`GameUtil`");
      expect(localizedContent("plum-b", locale)).toContain("SwiftUI");
    }
  });

  it("removes the Eco Flow System example", () => {
    expect(getProject("eco-flow-system")).toBeUndefined();
  });

  it("returns circular previous and next projects", () => {
    expect(getAdjacentProjects("cat-time-companion").next?.slug).toBe("fusheng-records");
    expect(getAdjacentProjects("cat-time-companion").previous?.slug).toBe("plum-b");
    expect(getAdjacentProjects("fusheng-records").next?.slug).toBe("easy-cat-minesweeper");
    expect(getAdjacentProjects("fusheng-records").previous?.slug).toBe("cat-time-companion");
    expect(getAdjacentProjects("easy-cat-minesweeper").next?.slug).toBe("plum-b");
    expect(getAdjacentProjects("easy-cat-minesweeper").previous?.slug).toBe("fusheng-records");
    expect(getAdjacentProjects("plum-b").next?.slug).toBe("cat-time-companion");
    expect(getAdjacentProjects("plum-b").previous?.slug).toBe("easy-cat-minesweeper");
  });
});
