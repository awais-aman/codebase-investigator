import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { simpleGit } from 'simple-git';
import { REPO_CLONE_ROOT } from '@/shared/constants';
import { ParsedGithubUrl } from '@/repos/dto/parsed-github-url.dto';

@Injectable()
export class ReposService {
  private readonly logger = new Logger(ReposService.name);

  parseGithubUrl(input: string): ParsedGithubUrl {
    const trimmed = input.trim();
    // Accept https://github.com/owner/repo, https://github.com/owner/repo.git,
    // and trailing slashes / branches (we discard branch path here).
    const match = trimmed.match(
      /^https?:\/\/github\.com\/([^/\s]+)\/([^/\s.]+)(\.git)?\/?$/i,
    );
    if (!match) {
      throw new BadRequestException(
        'Expected a public GitHub URL like https://github.com/owner/repo',
      );
    }
    const [, owner, name] = match;
    return {
      owner,
      name,
      cloneUrl: `https://github.com/${owner}/${name}.git`,
      webUrl: `https://github.com/${owner}/${name}`,
    };
  }

  pathFor(sessionId: string): string {
    return join(REPO_CLONE_ROOT, sessionId);
  }

  async clone(sessionId: string, parsed: ParsedGithubUrl): Promise<string> {
    const target = this.pathFor(sessionId);

    if (existsSync(target)) {
      this.logger.log(`Repo for session ${sessionId} already cloned`);
      return target;
    }

    await mkdir(REPO_CLONE_ROOT, { recursive: true });

    this.logger.log(`Cloning ${parsed.webUrl} -> ${target}`);
    try {
      await simpleGit().clone(parsed.cloneUrl, target, ['--depth', '1']);
    } catch (err) {
      // If clone half-finished, clean up so retries are clean.
      await this.remove(sessionId).catch(() => undefined);
      const message = err instanceof Error ? err.message : 'unknown error';
      throw new BadRequestException(
        `Failed to clone ${parsed.webUrl}: ${message}. Make sure the repo exists and is public.`,
      );
    }

    return target;
  }

  async remove(sessionId: string): Promise<void> {
    const target = this.pathFor(sessionId);
    if (!existsSync(target)) return;
    await rm(target, { recursive: true, force: true });
  }
}
