import { NextResponse } from "next/server";

export interface ProjectItem {
  id: string;
  name: string;
  owner: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  topics: string[];
  isPinned: boolean;
  updatedAt: string | null;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  C: "#555555",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  Shell: "#89e051",
};

export async function GET() {
  const username = "ankit-blazeneuro";

  try {
    // 1. Fetch user repos list from GitHub REST API (to enrich descriptions, topics, star counts, homepages)
    let restReposMap = new Map<string, any>();
    try {
      const restRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: {
            "User-Agent": "Portfolio-App/1.0",
            Accept: "application/vnd.github.v3+json",
          },
          signal: AbortSignal.timeout(5000),
          next: { revalidate: 3600 },
        }
      );
      if (restRes.ok) {
        const restRepos = await restRes.json();
        if (Array.isArray(restRepos)) {
          restRepos.forEach((repo: any) => {
            restReposMap.set(repo.name.toLowerCase(), repo);
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch REST repos list:", err);
    }

    // 2. Scrape user profile page to extract pinned repositories in exact pinned order
    let pinnedProjects: ProjectItem[] = [];
    try {
      const profileRes = await fetch(`https://github.com/${username}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      });

      if (profileRes.ok) {
        const html = await profileRes.text();
        const repoMatches = [
          ...html.matchAll(/class="[^"]*js-pinned-item-list-item[^"]*"[\s\S]*?<\/li>/g),
        ];

        for (const m of repoMatches) {
          const itemHtml = m[0];
          const repoNameMatch = itemHtml.match(
            new RegExp(`href="/${username}/([^"/]+)"`)
          );

          if (!repoNameMatch) continue;

          const repoName = repoNameMatch[1];
          const restInfo = restReposMap.get(repoName.toLowerCase());

          const descMatch = itemHtml.match(
            /class="pinned-item-desc[^"]*">([\s\S]*?)<\/p>/
          );
          const scrapedDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";

          const langMatch = itemHtml.match(
            /itemprop="programmingLanguage">([^<]+)<\/span>/
          );
          const scrapedLang = langMatch ? langMatch[1].trim() : null;

          const langColorMatch = itemHtml.match(
            /class="repo-language-color"[^>]*style="background-color:\s*([^";]+)/
          );
          const scrapedLangColor = langColorMatch ? langColorMatch[1].trim() : null;

          const starsMatch = itemHtml.match(
            new RegExp(
              `href="/${username}/${repoName}/stargazers"[\\s\\S]*?<\\/svg>\\s*([\\d,kK\\.\\s]+)`
            )
          );
          const scrapedStars = starsMatch
            ? parseInt(starsMatch[1].replace(/,/g, "").trim(), 10) || 0
            : 0;

          const forksMatch = itemHtml.match(
            new RegExp(
              `href="/${username}/${repoName}/network/members"[\\s\\S]*?<\\/svg>\\s*([\\d,kK\\.\\s]+)`
            )
          );
          const scrapedForks = forksMatch
            ? parseInt(forksMatch[1].replace(/,/g, "").trim(), 10) || 0
            : 0;

          const finalLang = restInfo?.language || scrapedLang || null;
          const finalLangColor =
            scrapedLangColor || (finalLang ? LANGUAGE_COLORS[finalLang] || "#888888" : null);

          pinnedProjects.push({
            id: restInfo?.id?.toString() || repoName,
            name: restInfo?.name || repoName,
            owner: username,
            description: restInfo?.description || scrapedDesc || "No description provided.",
            url: restInfo?.html_url || `https://github.com/${username}/${repoName}`,
            homepage: restInfo?.homepage || null,
            language: finalLang,
            languageColor: finalLangColor,
            stars: restInfo?.stargazers_count ?? scrapedStars,
            forks: restInfo?.forks_count ?? scrapedForks,
            topics: restInfo?.topics || [],
            isPinned: true,
            updatedAt: restInfo?.updated_at || null,
          });
        }
      }
    } catch (err) {
      console.warn("Failed scraping GitHub profile for pinned repos:", err);
    }

    // 3. Fallback: If scraper returned no pinned repos (e.g., rate limit / structure change),
    // use top 6 starred/updated repos from REST API
    if (pinnedProjects.length === 0 && restReposMap.size > 0) {
      const topRepos = Array.from(restReposMap.values())
        .filter((r: any) => !r.fork)
        .slice(0, 6);

      pinnedProjects = topRepos.map((r: any) => ({
        id: r.id.toString(),
        name: r.name,
        owner: username,
        description: r.description || "No description provided.",
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language || null,
        languageColor: r.language ? LANGUAGE_COLORS[r.language] || "#888888" : null,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        topics: r.topics || [],
        isPinned: false,
        updatedAt: r.updated_at || null,
      }));
    }

    return NextResponse.json(
      {
        success: true,
        username,
        count: pinnedProjects.length,
        projects: pinnedProjects,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch GitHub pinned projects",
        projects: [],
      },
      { status: 500 }
    );
  }
}
