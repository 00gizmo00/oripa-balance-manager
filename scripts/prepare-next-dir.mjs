import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const distDirName = ".next-app";
const projectDistPath = path.join(projectRoot, distDirName);
const mode = process.argv[2] ?? "build";

async function pathExists(targetPath) {
  try {
    await fs.lstat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureWindowsJunction() {
  const localAppData = process.env.LOCALAPPDATA;

  if (!localAppData) {
    return;
  }

  const targetDir = path.join(localAppData, "oripa-balance-manager", distDirName);
  await fs.mkdir(path.dirname(targetDir), { recursive: true });
  await fs.mkdir(targetDir, { recursive: true });

  if (await pathExists(projectDistPath)) {
    const stat = await fs.lstat(projectDistPath);
    if (!stat.isSymbolicLink()) {
      await fs.rm(projectDistPath, { recursive: true, force: true });
    }
  }

  if (!(await pathExists(projectDistPath))) {
    await fs.symlink(targetDir, projectDistPath, "junction");
  }
}

async function ensureLocalDirectory() {
  if (await pathExists(projectDistPath)) {
    const stat = await fs.lstat(projectDistPath);
    if (stat.isSymbolicLink()) {
      await fs.rm(projectDistPath, { recursive: true, force: true });
    }
  }

  await fs.mkdir(projectDistPath, { recursive: true });
}

async function main() {
  if (mode === "dev" && process.platform === "win32") {
    await ensureWindowsJunction();
    return;
  }

  await ensureLocalDirectory();
}

main().catch((error) => {
  console.error("Failed to prepare Next.js build directory.");
  console.error(error);
  process.exit(1);
});
