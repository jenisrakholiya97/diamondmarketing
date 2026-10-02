// Trade Reviews and Ratings Data Model - Default zero initialized.
// Only real user-submitted reviews will be displayed on the platform.

export const INITIAL_REVIEWS = [];

export const RATING_STATS = {
  averageRating: "0.0",
  totalReviews: 0,
  satisfactionRate: "0.0%",
  breakdown: [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ],
  categoryScores: [
    { name: "Optics & Fire Quality", score: 0.0 },
    { name: "360° HD Video Accuracy", score: 0.0 },
    { name: "Insured Transit Speed", score: 0.0 },
    { name: "Surat Direct Pricing", score: 0.0 },
  ],
};
