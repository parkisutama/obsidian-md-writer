// Adapted from https://github.com/chhoumann/quickadd/blob/master/src/gui/UpdateModal/UpdateModal.ts

import {
  type App,
  Component,
  MarkdownRenderer,
  Modal,
  requestUrl,
} from "obsidian";
import fundingText from "@/texts/Funding.md" with { type: "text" };
import updateNotice from "@/texts/UpdateNotice.md" with { type: "text" };

interface Release {
  body: string;
  draft: boolean;
  prerelease: boolean;
  tag_name: string;
}

const GIT_SUFFIX_REGEX = /\.git$/u;
const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)$/u;

function parseGitHubRepo(repoUrl: string) {
  const normalizedUrl = repoUrl.trim().replace(GIT_SUFFIX_REGEX, "");
  const match = GITHUB_REPO_URL_REGEX.exec(normalizedUrl);

  if (!match?.groups) {
    throw new Error(`Unsupported GitHub repository URL: ${repoUrl}`);
  }

  return {
    owner: match.groups.owner,
    repo: match.groups.repo,
  };
}

/**
 * Fetches the releases for a repository on GitHub and returns the release notes for every release
 * that comes after a specific release.
 *
 * @param repoOwner The owner of the repository.
 * @param repoName The name of the repository.
 * @param releaseTagName The tag name of the release to start getting release notes from.
 * @returns An array of Release objects, each containing the tag name and release notes for a single release.
 * @throws An error if there was an error fetching the releases or if the release with the specified tag name
 *         could not be found.
 */
async function getReleaseNotesAfter(
  repoOwner: string,
  repoName: string,
  releaseTagName: string | null,
  includePreReleases: boolean
): Promise<Release[]> {
  const response = await requestUrl({
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/releases`,
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
    },
  });
  const releases = response.json as Release[] | { message: string };

  if (
    (response.status >= 400 && "message" in releases) ||
    !Array.isArray(releases)
  ) {
    throw new Error(
      `Failed to fetch releases: ${releases.message ?? "Unknown error"}`
    );
  }

  // If releaseTagName is null show all release notes
  if (releaseTagName == null) {
    return releases.filter((release) => !(release.draft || release.prerelease));
  }

  const startReleaseIdx = releases.findIndex(
    (release) => release.tag_name === releaseTagName
  );

  if (startReleaseIdx === -1) {
    throw new Error(`Could not find release with tag ${releaseTagName}`);
  }

  return releases
    .slice(0, startReleaseIdx)
    .filter(
      (release) => !release.draft && (includePreReleases || !release.prerelease)
    );
}

export class UpdateModal extends Modal {
  private readonly currentVersion: string;
  private readonly previousVersion: string | null;
  private readonly repoUrl: string;
  private markdownRenderComponent: Component | null = null;

  constructor(
    app: App,
    currentVersion: string,
    previousVersion: string | null,
    repoUrl: string
  ) {
    super(app);
    this.currentVersion = currentVersion;
    this.previousVersion = previousVersion;
    this.repoUrl = repoUrl;
  }

  private fetchAndDisplayReleaseNotes() {
    const isCurrentVersionBeta = this.currentVersion.includes("-");
    const { owner, repo } = parseGitHubRepo(this.repoUrl);
    getReleaseNotesAfter(
      owner,
      repo,
      this.previousVersion,
      isCurrentVersionBeta // if the current version is a beta version, include pre-releases
    )
      .then((releases) => {
        if (releases.length === 0) {
          this.displayError(new Error("No new releases found"));
        } else {
          this.displayReleaseNotes(releases);
        }
      })
      .catch((err) => {
        this.displayError(err);
      });
  }

  override onOpen() {
    const { contentEl } = this;
    this.clearRenderedMarkdown();
    contentEl.empty();
    contentEl.createEl("h2", {
      text: "Fetching release notes...",
    });

    this.fetchAndDisplayReleaseNotes();
  }

  override onClose(): void {
    this.clearRenderedMarkdown();
  }

  private clearRenderedMarkdown(): void {
    this.markdownRenderComponent?.unload();
    this.markdownRenderComponent = null;
  }

  private displayReleaseNotes(releases: Release[]): void {
    const { contentEl } = this;
    this.clearRenderedMarkdown();
    contentEl.empty();
    contentEl.classList.add("ptm-update-modal-container");
    const contentDiv = contentEl.createDiv("ptm-update-modal");

    const releaseNotes = releases
      .map((release) => `### ${release.tag_name}\n\n${release.body}`)
      .join("\n---\n");

    const markdownStr = updateNotice
      .replace("{{tag-name}}", releases[0].tag_name)
      .replace("{{funding}}", fundingText)
      .replace("{{release-notes}}", releaseNotes);

    const renderComponent = new Component();
    this.markdownRenderComponent = renderComponent;

    MarkdownRenderer.render(
      this.app,
      markdownStr,
      contentDiv,
      this.app.vault.getRoot().path,
      renderComponent
    );
  }

  private displayError(error: Error): void {
    const { contentEl } = this;
    this.clearRenderedMarkdown();
    contentEl.empty();
    contentEl.classList.add("ptm-update-modal-container");
    const contentDiv = contentEl.createDiv("ptm-update-modal");

    contentDiv.createEl("h2", { text: error.message });
  }
}
