// src/app/Admin/pages/Seat/components/SeatGrid.tsx

import React, { useRef, useCallback } from 'react';
import { Tooltip } from 'antd';
import Selecto from 'react-selecto';
import type { Seat, SeatType } from '../type';
import { SEAT_TYPE_CONFIG, ALL_SEAT_TYPES } from '../constants';
import { seatKey, groupSeatsByRow } from '../utils';

interface Props {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  onSelectEnd: (keys: Set<string>) => void;
}

const SeatGrid: React.FC<Props> = ({ seats, onSeatClick, onSelectEnd }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { sortedRows, seatsByRow } = groupSeatsByRow(seats);

  const handleSelectEnd = useCallback(
    (e: any) => {
      const selected: Element[] = e.selected;
      if (selected.length === 0) return;
      const keys = new Set(
        selected
          .map(el => el.getAttribute('data-seat-key') ?? '')
          .filter(Boolean),
      );
      onSelectEnd(keys);
      selected.forEach(el => el.classList.remove('selecto-selected'));
    },
    [onSelectEnd],
  );

  return (
    <>
      {/* Screen indicator */}
      <div className="flex justify-center mb-6">
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60" />
      </div>
      <div className="text-center text-xs text-gray-400 mb-6 tracking-widest uppercase">
        — Màn hình —
      </div>

      {/* Grid + Selecto */}
      <div className="overflow-x-auto" ref={scrollContainerRef}>
        <Selecto
          container={scrollContainerRef.current}
          selectableTargets={['button[data-seat-key]']}
          selectByClick={false}
          selectFromInside={true}
          continueSelect={false}
          hitRate={0}
          ratio={0}
          onSelect={(e) => {
            e.added.forEach(el => el.classList.add('selecto-selected'));
            e.removed.forEach(el => el.classList.remove('selecto-selected'));
          }}
          onSelectEnd={handleSelectEnd}
        />

        <div className="flex flex-col items-center">
          {sortedRows.map(row => {
            const rowSeats = seatsByRow[row].sort(
              (a, b) => a.seat_number - b.seat_number,
            );
            return (
              <div
                key={row}
                className="flex items-center justify-center gap-1 mb-1.5"
              >
                {/* Row label */}
                <span className="w-6 text-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {row}
                </span>

                {/* Seats */}
                <div className="flex gap-1 flex-wrap">
                  {rowSeats.map((seat, idx) => {
                    const cfg = SEAT_TYPE_CONFIG[seat.seat_type];
                    const isCouple = seat.seat_type === 'COUPLE';
                    const isFirstOfPair = isCouple && seat._colIndex! % 2 === 0;

                    return (
                      <React.Fragment key={`${seat.seat_row}-${seat.seat_number}`}>
                        {/* Gap giữa các cặp couple */}
                        {isCouple && isFirstOfPair && idx > 0 && (
                          <div className="w-1" />
                        )}
                        <Tooltip
                          title={`${seat.seat_row}${seat.seat_number} — ${cfg.label}`}
                          mouseEnterDelay={0.5}
                        >
                          <button
                            data-seat-key={seatKey(seat)}
                            onClick={() => onSeatClick(seat)}
                            className="w-7 h-7 rounded text-xs font-bold border-2 transition-all duration-100 hover:scale-110 hover:shadow-md flex items-center justify-center cursor-pointer selecto-seat"
                            style={{
                              background: cfg.bg,
                              borderColor: cfg.border,
                              color: cfg.color,
                              borderRadius: isCouple
                                ? isFirstOfPair
                                  ? '6px 2px 2px 6px'
                                  : '2px 6px 6px 2px'
                                : '6px',
                            }}
                          >
                            {seat.seat_number}
                          </button>
                        </Tooltip>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Count per row */}
                <span className="ml-2 text-xs text-gray-400 flex-shrink-0">
                  {rowSeats.length} ghế
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 pt-4 border-t justify-center flex-wrap">
        {ALL_SEAT_TYPES.map(type => {
          const cfg = SEAT_TYPE_CONFIG[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded border-2 inline-block"
                style={{ background: cfg.bg, borderColor: cfg.border }}
              />
              <span className="text-xs text-gray-600">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Selecto styles */}
      <style>{`
        .selecto-selected {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 1px;
          transform: scale(1.12) !important;
          z-index: 10;
          position: relative;
        }
        .selecto-area {
          background: rgba(59, 130, 246, 0.1) !important;
          border: 1px solid rgba(59, 130, 246, 0.6) !important;
        }
      `}</style>
    </>
  );
};

export default SeatGrid;