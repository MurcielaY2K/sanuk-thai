import { WORLDS } from '../data/worlds';
import { Conversation, conversationKey } from '../data/conversations';

export type ConversationState = 'locked' | 'premium-locked' | 'available' | 'complete';

// A conversation opens once enough lessons of its world are done, so the
// learner meets its vocabulary first. Like lessons, a finished one stays
// replayable, and Premium is judged at read time, never stored.
export function conversationState(
  conv: Conversation,
  lessonProgress: Record<string, string>,
  isPremium: boolean,
): ConversationState {
  if (lessonProgress[conversationKey(conv.id)] === 'complete') return 'complete';
  const world = WORLDS.find(w => w.id === conv.worldId);
  if (!world) return 'locked';
  if (world.isPremium && !isPremium) return 'premium-locked';
  const done = world.lessons.filter(l => lessonProgress[l.id] === 'complete').length;
  return done >= conv.unlockAfter ? 'available' : 'locked';
}

export function lessonsUntilUnlock(conv: Conversation, lessonProgress: Record<string, string>): number {
  const world = WORLDS.find(w => w.id === conv.worldId);
  const done = world ? world.lessons.filter(l => lessonProgress[l.id] === 'complete').length : 0;
  return Math.max(0, conv.unlockAfter - done);
}
