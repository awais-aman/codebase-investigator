export enum Provides {
  Anthropic = 'Anthropic',
}

export enum RoutePaths {
  Sessions = 'sessions',
  Messages = 'messages',
}

export const ANTHROPIC_INVESTIGATOR_MODEL = 'claude-sonnet-4-6';
export const ANTHROPIC_AUDITOR_MODEL = 'claude-haiku-4-5-20251001';

export const REPO_CLONE_ROOT = '/tmp/codebase-investigator/repos';

export const MAX_TURNS_PER_INVESTIGATION = 12;
export const MAX_FILE_READ_BYTES = 200_000;
export const MAX_GREP_RESULTS = 50;
