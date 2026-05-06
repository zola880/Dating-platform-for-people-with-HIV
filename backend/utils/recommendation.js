// Stopwords list
const stopwords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'with'
]);

/**
 * Extract keywords from a text
 */
function extractKeywords(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));
}

/**
 * Update a user's interests based on their bio
 */
async function updateUserInterests(user) {
  const keywords = extractKeywords(user.bio || '');
  const unique = [...new Set([...user.interests, ...keywords])];
  user.interests = unique.slice(0, 20);
  await user.save();
}

/**
 * Calculate compatibility score between two users
 */
// (other parts unchanged)
function compatibilityScore(userA, userB) {
  let score = 0;

  // Age difference (max 10)
  const ageDiff = Math.abs(userA.age - userB.age);
  score += Math.max(0, 10 - ageDiff);

  // Interest overlap (max 30)
  const interestsA = new Set(userA.interests || []);
  const interestsB = new Set(userB.interests || []);
  const intersection = new Set([...interestsA].filter(x => interestsB.has(x)));
  const union = new Set([...interestsA, ...interestsB]);
  const jaccard = union.size === 0 ? 0 : intersection.size / union.size;
  score += jaccard * 30;

  return Math.round(score);
}

module.exports = {
  extractKeywords,
  updateUserInterests,
  compatibilityScore
};