/**
 * Calculate Mastery Percentage
 * 
 * Converts card mastery distribution into a single percentage.
 * Used to show mastery progress rings on the dashboard.
 * 
 * @param unseen - Count of unseen cards
 * @param weak - Count of weak (struggling) cards
 * @param learning - Count of learning cards
 * @param strong - Count of strong cards
 * @param mastered - Count of mastered cards
 * @returns Mastery percentage (0-100)
 */
export function calculateMastery(
  unseen: number,
  weak: number,
  learning: number,
  strong: number,
  mastered: number
): number {
  const total = unseen + weak + learning + strong + mastered

  if (total === 0) return 0

  // Weight: mastered=5, strong=4, learning=2, weak=1, unseen=0
  const weightedScore =
    mastered * 5 +
    strong * 4 +
    learning * 2 +
    weak * 1 +
    unseen * 0

  const maxScore = total * 5
  const percentage = (weightedScore / maxScore) * 100

  return Math.round(percentage)
}

/**
 * Get Mastery Level Label
 * 
 * Returns a human-readable label for a percentage.
 * 
 * @param percentage - Mastery percentage (0-100)
 * @returns Label like "Beginner", "Proficient", "Mastered"
 */
export function getMasteryLabel(percentage: number): string {
  if (percentage === 0) return 'Not Started'
  if (percentage < 25) return 'Beginner'
  if (percentage < 50) return 'Learning'
  if (percentage < 75) return 'Proficient'
  if (percentage < 100) return 'Advanced'
  return 'Mastered'
}
