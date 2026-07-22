// Click Draw winners — published to logged-in members only.
//
// TO UPDATE EACH MONTH:
//   1. Add a new object at the TOP of `drawMonths` (newest first).
//   2. `id` is YYYY-MM. `label` is what members see, e.g. "July 2026".
//   3. `drawnOn` is the date the draw was actually run (YYYY-MM-DD).
//   4. List 11 winners: one prize of 50 and ten of 10, per the regulation.
//
// WHY FULL NAMES ARE OK HERE: Section 8 of the Click Draw terms secures each
// participant's consent to have their identity announced. This page sits behind
// member login. It must NEVER be linked from, or rendered on, any public
// (site) route — the public testimonials are anonymised for exactly that
// reason, and the two decisions are not in conflict because the audiences differ.
//
// PLACEHOLDER (business-critical): the month below is invented sample data and
// must be replaced with the real draw results before launch.

export type DrawWinner = { country: string; flag: string; name: string; prize: number };
export type DrawMonth = { id: string; label: string; drawnOn: string; winners: DrawWinner[] };

export const drawMonths: DrawMonth[] = [
  {
    id: '2026-06',
    label: 'June 2026',
    drawnOn: '2026-07-14',
    winners: [
      { country: 'Romania', flag: '🇷🇴', name: 'Maria Popescu', prize: 50 },
      { country: 'Germany', flag: '🇩🇪', name: 'Thomas Keller', prize: 10 },
      { country: 'Poland', flag: '🇵🇱', name: 'Anna Wójcik', prize: 10 },
      { country: 'Italy', flag: '🇮🇹', name: 'Giulia Rossi', prize: 10 },
      { country: 'Spain', flag: '🇪🇸', name: 'Carlos Ferrer', prize: 10 },
      { country: 'France', flag: '🇫🇷', name: 'Camille Dubois', prize: 10 },
      { country: 'Hungary', flag: '🇭🇺', name: 'Eszter Nagy', prize: 10 },
      { country: 'Romania', flag: '🇷🇴', name: 'Andrei Ionescu', prize: 10 },
      { country: 'Bulgaria', flag: '🇧🇬', name: 'Dimitar Petrov', prize: 10 },
      { country: 'Czechia', flag: '🇨🇿', name: 'Petra Nováková', prize: 10 },
      { country: 'Greece', flag: '🇬🇷', name: 'Nikos Papadakis', prize: 10 },
    ],
  },
];

export const latestDrawMonth = drawMonths[0];
