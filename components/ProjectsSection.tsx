"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Pin,
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Search,
  Code2,
  FolderGit2,
} from "lucide-react";
import { ProjectItem } from "@/app/api/github/pinned/route";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProjects = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/github/pinned", {
        cache: isManualRefresh ? "no-store" : "default",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        throw new Error(data.error || "Failed to load projects");
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Could not fetch GitHub pinned repositories.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Compute available languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach((p) => {
      if (p.language) langs.add(p.language);
    });
    return ["All", ...Array.from(langs)];
  }, [projects]);

  // Filter projects by language & search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesLang =
        selectedLanguage === "All" || project.language === selectedLanguage;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.topics.some((t) => t.toLowerCase().includes(q)) ||
        (project.language && project.language.toLowerCase().includes(q));

      return matchesLang && matchesSearch;
    });
  }, [projects, selectedLanguage, searchQuery]);

  return (
    <section
      id="projects"
      className="relative z-10 w-full max-w-7xl mx-auto pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-20 px-3.5 sm:px-8 lg:px-12 font-space-mono text-left"
    >
      {/* Minimalist Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-zinc-800">
        <div className="space-y-3 max-w-2xl">
          {/* Minimalist Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs text-zinc-300 font-space-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="tracking-wide">GITHUB PINS :: SYNCED</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-space-mono">
            Projects
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed font-space-mono">
            A minimalist showcase of repositories pinned on my GitHub profile.
          </p>
        </div>

        {/* Action / Sync Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchProjects(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black border border-zinc-800 transition-colors text-xs font-space-mono disabled:opacity-50 cursor-pointer active:scale-95"
            title="Sync latest pinned repos from GitHub"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>{refreshing ? "Syncing..." : "Sync Pins"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-6 sm:my-8">
        {/* Language Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-md text-xs font-space-mono transition-colors cursor-pointer border ${
                selectedLanguage === lang
                  ? "bg-white text-black font-semibold border-white"
                  : "bg-black text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Minimalist Search Box */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-black border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors font-space-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-xl bg-black border border-zinc-800/80 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="h-5 bg-zinc-800 rounded w-1/2" />
                <div className="h-4 bg-zinc-800 rounded w-12" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-zinc-800/80 rounded w-full" />
                <div className="h-3 bg-zinc-800/80 rounded w-4/5" />
              </div>
              <div className="pt-4 border-t border-zinc-900 flex justify-between">
                <div className="h-4 bg-zinc-800 rounded w-20" />
                <div className="h-4 bg-zinc-800 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {!loading && error && projects.length === 0 && (
        <div className="p-8 sm:p-12 rounded-xl bg-black border border-zinc-800 text-center space-y-4 my-6 font-space-mono">
          <FolderGit2 className="w-8 h-8 text-zinc-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              Unable to load GitHub Projects
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={() => fetchProjects(true)}
            className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200 text-xs font-semibold font-space-mono transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="p-10 rounded-xl bg-black border border-zinc-800 text-center space-y-3 my-6 font-space-mono">
          <Code2 className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm">
            No projects found matching query.
          </p>
          <button
            onClick={() => {
              setSelectedLanguage("All");
              setSearchQuery("");
            }}
            className="text-xs text-white hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Minimalist Projects Grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.name}
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-xl bg-black border border-zinc-800 hover:border-white transition-colors duration-200 font-space-mono"
            >
              <div className="space-y-3">
                {/* Header: Title & Pin Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderGit2 className="w-4 h-4 text-zinc-400 shrink-0 group-hover:text-white transition-colors" />
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-white group-hover:underline underline-offset-4 truncate"
                      title={project.name}
                    >
                      {project.name}
                    </a>
                  </div>

                  {project.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-700 text-[10px] text-zinc-300 shrink-0">
                      <Pin className="w-2.5 h-2.5 fill-white text-white" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3 min-h-[3rem]">
                  {project.description}
                </p>

                {/* Minimalist Topics */}
                {project.topics && project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-[10px] rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Metadata & Links */}
              <div className="pt-5 mt-4 border-t border-zinc-900 flex items-center justify-between gap-2 text-xs">
                {/* Left: Language & Stats */}
                <div className="flex items-center gap-3">
                  {project.language && (
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-white inline-block" />
                      <span className="text-[11px]">{project.language}</span>
                    </div>
                  )}

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-zinc-400" title="Stars">
                    <Star className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-[11px]">{project.stars}</span>
                  </div>

                  {/* Forks */}
                  {project.forks > 0 && (
                    <div className="flex items-center gap-1 text-zinc-400" title="Forks">
                      <GitFork className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-[11px]">{project.forks}</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black border border-zinc-800 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black border border-zinc-800 transition-colors text-[11px]"
                  >
                    <GithubIcon className="w-3 h-3" />
                    <span>Code</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
