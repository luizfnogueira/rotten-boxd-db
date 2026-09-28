import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: string;
  color?: string;
  showLabel?: boolean;
}

/**
 * Rating de 1 a 5 estrelas com meia estrela, no estilo Letterboxd.
 * Clicar na metade esquerda de uma estrela marca X.5; na direita, X.0.
 * Sem onChange, funciona como exibição (suporta valores fracionários).
 */
export default function StarRating({
  value,
  onChange,
  size = '1.8rem',
  color = '#00e054',
  showLabel = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const interactive = !!onChange;
  const displayValue = hoverValue ?? value;

  const valueFromEvent = (star: number, e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    return isLeftHalf ? star - 0.5 : star;
  };

  const fillFor = (star: number): string => {
    if (displayValue >= star) return '100%';
    if (displayValue >= star - 0.5) return '50%';
    return '0%';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{ display: 'flex', gap: '2px', fontSize: size, lineHeight: 1, cursor: interactive ? 'pointer' : 'default' }}
        onMouseLeave={() => interactive && setHoverValue(null)}
        title={`${displayValue.toFixed(1)} de 5`}
      >
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseMove={interactive ? e => setHoverValue(valueFromEvent(star, e)) : undefined}
            onClick={interactive ? e => onChange!(valueFromEvent(star, e)) : undefined}
          >
            <span style={{ color: '#445566' }}>★</span>
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: fillFor(star),
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color,
              }}
            >
              ★
            </span>
          </span>
        ))}
      </div>
      {showLabel && (
        <span style={{ fontSize: '0.8rem', color: '#8b9bab', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {displayValue > 0 ? `${displayValue.toFixed(1)} out of 5` : ''}
        </span>
      )}
    </div>
  );
}

/** Estrelas em texto (ex.: "★★★½") para listas de reviews. */
export function starString(nota: number): string {
  return '★'.repeat(Math.floor(nota)) + (nota % 1 !== 0 ? '½' : '');
}
