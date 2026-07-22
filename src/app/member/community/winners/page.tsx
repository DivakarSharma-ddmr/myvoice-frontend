'use client';
import { useState } from 'react';
import Link from 'next/link';
import { drawMonths } from '@/content/drawWinners';

export default function WinnersPage() {
  const [id, setId] = useState(drawMonths[0].id);
  const month = drawMonths.find((m) => m.id === id) ?? drawMonths[0];
  const countries = new Set(month.winners.map((w) => w.country)).size;

  return (
    <div className="max-w-[780px] space-y-4">
      <Link
        href="/member/community"
        className="inline-block text-[13px] font-bold text-teal hover:underline"
      >
        <span aria-hidden="true">← </span>Back to community
      </Link>

      <div className="rounded-2xl2 border border-bd bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold">Click Draw winners</h3>
            <p className="mt-0.5 text-[13px] text-mute">
              {month.winners.length} members across {countries}{' '}
              {countries === 1 ? 'country' : 'countries'} won in {month.label}.
            </p>
          </div>
          <label>
            <span className="sr-only">Choose a month</span>
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="rounded-[10px] border border-bd bg-white px-3 py-2 text-[13px] font-bold outline-none focus:border-teal"
            >
              {drawMonths.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Click Draw winners for {month.label}, with country, member name and prize.
            </caption>
            <thead>
              <tr className="border-b border-bd">
                <th scope="col" className="py-2 text-[12px] font-bold text-mute">
                  Country
                </th>
                <th scope="col" className="py-2 text-[12px] font-bold text-mute">
                  Member
                </th>
                <th scope="col" className="py-2 text-right text-[12px] font-bold text-mute">
                  Prize
                </th>
              </tr>
            </thead>
            <tbody>
              {month.winners.map((w, i) => (
                <tr key={i} className="border-b border-bd last:border-b-0">
                  <td className="py-2.5">
                    <span aria-hidden="true">{w.flag} </span>
                    {w.country}
                  </td>
                  <td className="py-2.5 font-semibold">{w.name}</td>
                  <td className="py-2.5 text-right font-extrabold text-dteal">€{w.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] leading-snug text-mute">
          Winners are drawn at random using random.org and published with their consent under the
          Click Draw terms. Each month’s draw takes place before the end of the following month.{' '}
          <Link href="/legal/click-draw" className="font-bold text-teal hover:underline">
            Read the full terms
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
