// ---------------------------------------------------------------------------
// Gym Tracker — Constants
// Motivational quotes and other static constants.
// ---------------------------------------------------------------------------

import { Quote } from "./types";

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  { text: "Don't limit your challenges. Challenge your limits.", author: "Unknown" },
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt" },
  { text: "What hurts today makes you stronger tomorrow.", author: "Jay Cutler" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "When you feel like quitting, think about why you started.", author: "Unknown" },
  { text: "Discipline is doing what needs to be done, even when you don't want to do it.", author: "Unknown" },
  { text: "The iron never lies to you. Two hundred pounds is always two hundred pounds.", author: "Henry Rollins" },
  { text: "Train insane or remain the same.", author: "Unknown" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "Sweat is just fat crying.", author: "Unknown" },
  { text: "No one ever drowned in sweat.", author: "Lou Holtz" },
  { text: "Fall in love with taking care of yourself.", author: "Unknown" },
  { text: "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.", author: "Arnold Schwarzenegger" },
  { text: "Champions aren't made in gyms. Champions are made from something they have deep inside them — a desire, a dream, a vision.", author: "Muhammad Ali" },
  { text: "Once you learn to quit, it becomes a habit.", author: "Vince Lombardi" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "If it doesn't challenge you, it won't change you.", author: "Fred DeVito" },
];

/**
 * Get a random motivational quote, optionally different from a given one.
 */
export function getRandomQuote(currentText?: string): Quote {
  let quote: Quote;
  do {
    quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  } while (quote.text === currentText && MOTIVATIONAL_QUOTES.length > 1);
  return quote;
}
