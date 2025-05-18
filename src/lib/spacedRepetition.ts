// spacedRepetition.ts

export type Card = {
  id: string;
  front: string;
  back: string;
  interval: number;      // days until next review
  repetitions: number;   // how many times reviewed consecutively
  easeFactor: number;    // easiness factor, starts at 2.5
  nextReview: Date;      // next scheduled review date
};

/**
 * Update card's spaced repetition data based on user response quality.
 * Quality is a number between 0-5 (0 = complete blackout, 5 = perfect recall)
 * 
 * @param card - The flashcard object to update
 * @param quality - Number (0 to 5) representing recall quality
 * @returns Updated card object with new interval and nextReview date
 */
export function updateCard(card: Card, quality: number): Card {
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }

  let { easeFactor, repetitions, interval } = card;

  // If quality < 3, reset repetitions
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Increase repetitions count
    repetitions += 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Update ease factor according to formula
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3; // minimum ease factor
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    nextReview,
  };
}

/**
 * Initialize a new card for spaced repetition
 * @param id - Unique card id
 * @param front - Front side content
 * @param back - Back side content
 * @param tags - Optional array of tags
 * @returns Initialized card object
 */
export function createCard(id: string, front: string, back: string, tags?: string[]): Card & {tags?: string[]} {
  return {
    id,
    front,
    back,
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: new Date(),
    tags
  };
}
