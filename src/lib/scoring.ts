export type ScoredTool = {
  upvotes?: number;
  downvotes?: number;
  date_added: string;
  is_open_source?: boolean;
};

export function getAiDexScore(tool: ScoredTool): number {
  const up = tool.upvotes ?? 0;
  const down = tool.downvotes ?? 0;
  const voteScore = up * 3 - down * 2;

  const daysOld = Math.max(0, (Date.now() - new Date(tool.date_added).getTime()) / (1000 * 60 * 60 * 24));
  const freshness = Math.max(0, 30 - daysOld) * 1.2;
  const openSourceBonus = tool.is_open_source ? 8 : 0;

  return Math.round(voteScore + freshness + openSourceBonus);
}
