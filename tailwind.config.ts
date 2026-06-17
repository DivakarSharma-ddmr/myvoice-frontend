import type { Config } from 'tailwindcss';

/**
 * Brand tokens come straight from the MyVoice design system
 * (teal #336666 / yellow #FFCC33, Plus Jakarta Sans).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C2526',
        teal: '#336666',
        dteal: '#1F4F4F',
        teal2: '#2c6a64',
        yel: '#FFCC33',
        syel: '#FFF4CC',
        lteal: '#E8F3F3',
        green: '#22A06B',
        amber: '#F59E0B',
        danger: '#D92D20',
        mute: '#667085',
        soft: '#52706e',
        gold: '#8a6d12',
        cream: '#FFFDF6',
        sand: '#FBF4E6',
        bd: '#F1ECDB',
        canvas: '#EEEFEB',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '18px',
        '2xl2': '22px',
        '3xl2': '28px',
      },
      boxShadow: {
        soft: '0 12px 30px -18px rgba(31,79,79,.3)',
        card: '0 18px 40px -26px rgba(31,79,79,.4)',
        lift: '0 30px 70px -34px rgba(31,79,79,.45)',
      },
      keyframes: {
        bfloat: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-9px)' } },
        bmarq: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        bpulse: { '0%,100%': { transform: 'scale(1)', opacity: '.9' }, '50%': { transform: 'scale(1.12)', opacity: '1' } },
        qconf: { '0%': { transform: 'translateY(0) rotate(0)', opacity: '1' }, '100%': { transform: 'translateY(700px) rotate(720deg)', opacity: '0' } },
        qpop: { '0%': { transform: 'scale(.85)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        qtoast: { '0%': { transform: 'translateX(40px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        qflame: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.18)' } },
        mbob: { '0%,100%': { transform: 'translateY(0) rotate(-2.5deg)' }, '50%': { transform: 'translateY(-9px) rotate(2.5deg)' } },
        mwave: { '0%,100%': { transform: 'rotate(-7deg)' }, '50%': { transform: 'rotate(9deg)' } },
        mcheer: { '0%,100%': { transform: 'translateY(0) scale(1)' }, '28%': { transform: 'translateY(-16px) scale(1.06)' }, '58%': { transform: 'translateY(0) scale(1)' } },
        mpoint: { '0%,100%': { transform: 'translateX(0) rotate(-2deg)' }, '50%': { transform: 'translateX(6px) rotate(3deg)' } },
      },
      animation: {
        bfloat: 'bfloat 6s ease-in-out infinite',
        bmarq: 'bmarq 34s linear infinite',
        bpulse: 'bpulse 2.6s ease-in-out infinite',
        qflame: 'qflame 1.4s ease-in-out infinite',
        mbob: 'mbob 3.4s ease-in-out infinite',
        mwave: 'mwave 2.1s ease-in-out infinite',
        mcheer: 'mcheer 1.7s ease-in-out infinite',
        mpoint: 'mpoint 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
