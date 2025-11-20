import https from "node:https";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

type IndexedResource = {
  key: string;
  indexUrls: string[];
  baseUrl: string;
  additionalFiles?: string[];
  outputSubDir?: string;
};

type DirectResource = {
  key: string;
  files: Array<string | { url: string; outputName?: string; outputSubDir?: string }>;
};

type DownloadError = {
  url: string;
  reason: string;
};

type DownloadReport = {
  category: string;
  saved: string[];
  errors: DownloadError[];
};

export interface DownloadOptions {
  /**
   * Base URL used by 5etools mirrors. Must end with a slash or point to the root.
   * Defaults to `https://cdn.5e.tools/2014/`.
   */
  baseSiteUrl?: string;
  /**
   * Art/map mirror root. Defaults to
   * `https://raw.githubusercontent.com/5etools-mirror-1/pab-index/main/`.
   */
  artMirrorUrl?: string;
  /**
   * Folder where all JSONs will be persisted. Defaults to
   * `<projectRoot>/src/services/migration/dungeons_and_dragons/data`.
   */
  outputDir?: string;
  /**
   * Categories to download. When omitted every known category is processed.
   */
  categories?: string[];
  /**
   * Parallel download limit. Defaults to 4.
   */
  concurrency?: number;
}

const USER_AGENT = "rpg-app-backend-migrator/1.0 (+github.com/vitorsantosb/rpg-app-backend)";
const MAX_REDIRECTS = 5;
const DEFAULT_CONCURRENCY = 4;

function ensureTrailingSlash(input: string): string {
  return input.endsWith("/") ? input : `${input}/`;
}

async function downloadBuffer(url: string, attempt = 0): Promise<Buffer> {
  const resolvedUrl = new URL(url);

  return new Promise((resolve, reject) => {
    const request = https.get(
      resolvedUrl,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json,text/plain,*/*",
        },
      },
      (response) => {
        const { statusCode, headers } = response;

        if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
          response.resume();
          if (attempt >= MAX_REDIRECTS) {
            reject(new Error(`Too many redirects while loading ${url}`));
            return;
          }
          const redirected = new URL(headers.location, resolvedUrl).toString();
          downloadBuffer(redirected, attempt + 1).then(resolve).catch(reject);
          return;
        }

        if (!statusCode || statusCode >= 400) {
          const errorChunks: Buffer[] = [];
          response.on("data", (chunk) => errorChunks.push(Buffer.from(chunk)));
          response.on("end", () => {
            const reason = Buffer.concat(errorChunks).toString("utf8") || `HTTP ${statusCode}`;
            reject(new Error(`Request to ${url} failed: ${reason}`));
          });
          return;
        }

        const data: Buffer[] = [];
        response.on("data", (chunk) => data.push(Buffer.from(chunk)));
        response.on("end", () => resolve(Buffer.concat(data)));
      }
    );

    request.on("error", (err) => reject(err));
  });
}

async function downloadJson<T>(url: string): Promise<T> {
  const buffer = await downloadBuffer(url);
  try {
    return JSON.parse(buffer.toString("utf8")) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${url}: ${(error as Error).message}`);
  }
}

async function saveFile(outputPath: string, data: Buffer | string): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  if (typeof data === "string") {
    await writeFile(outputPath, data, "utf8");
  } else {
    await writeFile(outputPath, data);
  }
}

function stripQuery(fileName: string): string {
  return fileName.split("?")[0];
}

function extractJsonFileNames(indexData: unknown): string[] {
  const collected = new Set<string>();

  const visit = (value: unknown) => {
    if (!value) return;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.toLowerCase().endsWith(".json")) {
        collected.add(stripQuery(trimmed));
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value === "object") {
      Object.values(value as Record<string, unknown>).forEach(visit);
    }
  };

  visit(indexData);

  return Array.from(collected);
}

async function processWithConcurrency<T>(
  items: T[],
  handler: (item: T) => Promise<void>,
  concurrency: number
): Promise<void> {
  const queue = [...items];
  const running: Promise<void>[] = [];

  while (queue.length || running.length) {
    while (queue.length && running.length < concurrency) {
      const item = queue.shift()!;
      const promise = handler(item).finally(() => {
        const index = running.indexOf(promise);
        if (index >= 0) running.splice(index, 1);
      });
      running.push(promise);
    }

    if (running.length) {
      await Promise.race(running);
    }
  }
}

function normaliseCategoryFilter(filter?: string[]): Set<string> | null {
  if (!filter || !filter.length) return null;
  return new Set(filter.map((entry) => entry.toLowerCase()));
}

function shouldProcessCategory(category: string, allowList: Set<string> | null): boolean {
  if (!allowList) return true;
  return allowList.has(category.toLowerCase());
}

function buildDefaultOptions(): Required<DownloadOptions> {
  const projectRoot = process.cwd();
  const baseSiteUrl = ensureTrailingSlash(
    process.env.DND_5ETOOLS_BASE_URL ?? "https://cdn.5e.tools/2014/"
  );
  const artMirrorUrl = ensureTrailingSlash(
    process.env.DND_5ETOOLS_ART_URL ??
      "https://raw.githubusercontent.com/5etools-mirror-1/pab-index/main/"
  );

  return {
    baseSiteUrl,
    artMirrorUrl,
    outputDir: path.resolve(
      projectRoot,
      "src",
      "services",
      "migration",
      "dungeons_and_dragons",
      "data"
    ),
    categories: [],
    concurrency: Number(process.env.DND_5ETOOLS_CONCURRENCY ?? DEFAULT_CONCURRENCY),
  };
}

function buildIndexedResources(baseSiteUrl: string): IndexedResource[] {
  const baseDataUrl = `${ensureTrailingSlash(baseSiteUrl)}data/`;
  return [
    {
      key: "spells",
      baseUrl: `${baseDataUrl}spells/`,
      indexUrls: [`${baseDataUrl}spells/index.json`],
      additionalFiles: [`${baseDataUrl}spells/roll20.json`],
    },
    {
      key: "monsters",
      baseUrl: `${baseDataUrl}bestiary/`,
      indexUrls: [
        `${baseDataUrl}bestiary/index.json`,
        `${baseDataUrl}bestiary/fluff-index.json`,
      ],
      additionalFiles: [`${baseDataUrl}bestiary/legendarygroups.json`],
      outputSubDir: "monsters",
    },
    {
      key: "classes",
      baseUrl: `${baseDataUrl}class/`,
      indexUrls: [`${baseDataUrl}class/index.json`, `${baseDataUrl}class/class-feature-index.json`],
    },
    {
      key: "adventures",
      baseUrl: `${baseDataUrl}adventure/`,
      indexUrls: [`${baseDataUrl}adventure/index.json`],
    },
  ];
}

function buildDirectResources(baseSiteUrl: string): DirectResource[] {
  const baseDataUrl = `${ensureTrailingSlash(baseSiteUrl)}data/`;
  return [
    {
      key: "items",
      files: [
        `${baseDataUrl}items.json`,
        `${baseDataUrl}items-base.json`,
        `${baseDataUrl}items-generic.json`,
        `${baseDataUrl}items-variants.json`,
        { url: `${baseDataUrl}roll20-items.json`, outputName: "roll20-items.json" },
      ],
    },
    {
      key: "backgrounds",
      files: [`${baseDataUrl}backgrounds.json`],
    },
    {
      key: "feats",
      files: [`${baseDataUrl}feats.json`],
    },
    {
      key: "optionalfeatures",
      files: [`${baseDataUrl}optionalfeatures.json`],
    },
    {
      key: "races",
      files: [`${baseDataUrl}races.json`],
    },
    {
      key: "psionics",
      files: [`${baseDataUrl}psionics.json`],
    },
    {
      key: "vehicles",
      files: [`${baseDataUrl}vehicles.json`],
    },
    {
      key: "objects",
      files: [`${baseDataUrl}objects.json`],
    },
    {
      key: "deities",
      files: [`${baseDataUrl}deities.json`],
    },
    {
      key: "adventures",
      files: [`${baseDataUrl}adventures.json`],
    },
  ];
}

function buildArtResources(artMirrorUrl: string): DirectResource[] {
  return [
    {
      key: "maps",
      files: [
        {
          url: `${ensureTrailingSlash(artMirrorUrl)}_meta_index.json`,
          outputName: "_meta_index.json",
          outputSubDir: "maps",
        },
      ],
    },
  ];
}

async function downloadIndexedCategory(
  resource: IndexedResource,
  outputDir: string,
  concurrency: number
): Promise<DownloadReport> {
  const saved: string[] = [];
  const errors: DownloadError[] = [];
  const categoryDir = path.join(outputDir, resource.outputSubDir ?? resource.key);

  for (const indexUrl of resource.indexUrls) {
    try {
      const indexData = await downloadJson<unknown>(indexUrl);
      const fileNames = extractJsonFileNames(indexData);
      await processWithConcurrency(
        fileNames,
        async (fileName) => {
          const resolvedUrl = new URL(fileName, resource.baseUrl).toString();
          try {
            const content = await downloadBuffer(resolvedUrl);
            const destination = path.join(categoryDir, stripQuery(fileName));
            await saveFile(destination, content);
            saved.push(destination);
          } catch (error) {
            const reason = (error as Error).message;
            console.warn(`[dnd-migrator] Failed to download ${resolvedUrl}: ${reason}`);
            errors.push({ url: resolvedUrl, reason });
          }
        },
        concurrency
      );

      const indexDestination = path.join(
        categoryDir,
        stripQuery(path.basename(new URL(indexUrl).pathname))
      );
      await saveFile(indexDestination, JSON.stringify(indexData, null, 2));
      saved.push(indexDestination);
    } catch (error) {
      const reason = (error as Error).message;
      console.warn(`[dnd-migrator] Failed to process index ${indexUrl}: ${reason}`);
      errors.push({ url: indexUrl, reason });
    }
  }

  if (resource.additionalFiles?.length) {
    await processWithConcurrency(
      resource.additionalFiles,
      async (fileUrl) => {
        try {
          const buffer = await downloadBuffer(fileUrl);
          const outputFile = path.join(
            categoryDir,
            stripQuery(path.basename(new URL(fileUrl).pathname))
          );
          await saveFile(outputFile, buffer);
          saved.push(outputFile);
        } catch (error) {
          const reason = (error as Error).message;
          console.warn(`[dnd-migrator] Failed to download ${fileUrl}: ${reason}`);
          errors.push({ url: fileUrl, reason });
        }
      },
      concurrency
    );
  }

  return { category: resource.key, saved, errors };
}

async function downloadDirectCategory(
  resource: DirectResource,
  outputDir: string,
  concurrency: number
): Promise<DownloadReport> {
  const saved: string[] = [];
  const errors: DownloadError[] = [];
  const categoryDir = path.join(outputDir, resource.key);

  const targets = resource.files.map((entry) =>
    typeof entry === "string"
      ? { url: entry, outputName: stripQuery(path.basename(new URL(entry).pathname)), outputSubDir: undefined }
      : {
          url: entry.url,
          outputName:
            entry.outputName ?? stripQuery(path.basename(new URL(entry.url).pathname)),
          outputSubDir: entry.outputSubDir,
        }
  );

  await processWithConcurrency(
    targets,
    async ({ url, outputName, outputSubDir }) => {
      try {
        const buffer = await downloadBuffer(url);
        const outputPath = path.join(categoryDir, outputSubDir ?? ".", outputName);
        await saveFile(outputPath, buffer);
        saved.push(outputPath);
      } catch (error) {
        const reason = (error as Error).message;
        console.warn(`[dnd-migrator] Failed to download ${url}: ${reason}`);
        errors.push({ url, reason });
      }
    },
    concurrency
  );

  return { category: resource.key, saved, errors };
}

export async function downloadDungeonsAndDragonsData(
  options: DownloadOptions = {}
): Promise<DownloadReport[]> {
  const defaults = buildDefaultOptions();
  const resolvedOptions: Required<DownloadOptions> = {
    ...defaults,
    ...options,
    baseSiteUrl: ensureTrailingSlash(options.baseSiteUrl ?? defaults.baseSiteUrl),
    artMirrorUrl: ensureTrailingSlash(options.artMirrorUrl ?? defaults.artMirrorUrl),
    outputDir: options.outputDir ?? defaults.outputDir,
    concurrency: options.concurrency ?? defaults.concurrency,
  };

  const allowList = normaliseCategoryFilter(resolvedOptions.categories);
  const outputDir = resolvedOptions.outputDir;
  const concurrency = resolvedOptions.concurrency;

  const indexedResources = buildIndexedResources(resolvedOptions.baseSiteUrl).filter((resource) =>
    shouldProcessCategory(resource.key, allowList)
  );

  const directResources = [
    ...buildDirectResources(resolvedOptions.baseSiteUrl),
    ...buildArtResources(resolvedOptions.artMirrorUrl),
  ].filter((resource) => shouldProcessCategory(resource.key, allowList));

  const reports: DownloadReport[] = [];

  for (const resource of indexedResources) {
    console.log(`[dnd-migrator] Downloading indexed category "${resource.key}"...`);
    reports.push(await downloadIndexedCategory(resource, outputDir, concurrency));
  }

  for (const resource of directResources) {
    console.log(`[dnd-migrator] Downloading direct category "${resource.key}"...`);
    reports.push(await downloadDirectCategory(resource, outputDir, concurrency));
  }

  return reports;
}

async function runCli(): Promise<void> {
  const [, , ...args] = process.argv;
  const categories =
    args.length && !args[0].startsWith("--") ? args[0].split(",").map((c) => c.trim()) : undefined;

  try {
    const reports = await downloadDungeonsAndDragonsData({
      categories,
    });

    const totalFiles = reports.reduce((acc, report) => acc + report.saved.length, 0);
    const totalErrors = reports.reduce((acc, report) => acc + report.errors.length, 0);

    console.log(`[dnd-migrator] Finished. Saved ${totalFiles} files.`);
    if (totalErrors) {
      console.warn(`[dnd-migrator] ${totalErrors} downloads failed. See log output above.`);
    }
  } catch (error) {
    console.error(`[dnd-migrator] Fatal error: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli().catch((error) => {
    console.error(`[dnd-migrator] Unexpected error: ${(error as Error).stack ?? error}`);
    process.exitCode = 1;
  });
}

