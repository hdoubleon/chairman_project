import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { SeatReservationDialog } from './SeatReservationDialog';
import { useStudyRoom } from '../contexts/StudyRoomContext';

export function SeatMap() {
  const { state, dispatch } = useStudyRoom();

  const getSeatColor = (seat: any) => {
    if (state.selectedSeat === seat.id) return 'bg-yellow-500';
    if (seat.isReserved) return 'bg-blue-500';
    if (!seat.isAvailable) return 'bg-red-500';
    return 'bg-green-500';
  };

  const getSeatStatus = (seat: any) => {
    if (seat.isReserved) return '예약됨';
    if (!seat.isAvailable) return '사용불가';
    return '사용가능';
  };

  const handleSeatClick = (seatId: string) => {
    dispatch({ type: 'SELECT_SEAT', payload: seatId });
  };

  const selectedSeat = state.seats.find(seat => seat.id === state.selectedSeat);

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-lg mb-2">자습실 배치도</h2>
        <p className="text-sm text-muted-foreground">자리를 클릭하여 상세 정보를 확인하거나 예약하세요.</p>
      </div>

      {/* 교단 */}
      <div className="flex justify-center mb-8">
        <div className="bg-accent px-8 py-3 rounded-lg">
          <span className="text-sm">🎓 교단</span>
        </div>
      </div>

      {/* 자리 배치도 */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-6 gap-4 mb-8">
          {state.seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${getSeatColor(seat)} text-white
                ${state.selectedSeat === seat.id ? 'border-yellow-300 scale-105' : 'border-transparent'}
                hover:scale-105 hover:shadow-lg
              `}
            >
              <div className="text-center">
                <div className="text-xs mb-1">#{seat.seatNumber}</div>
                <div className="text-xs opacity-80">{getSeatStatus(seat)}</div>
                {seat.isReserved && (
                  <div className="text-xs mt-1 truncate">{seat.reservedBy}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 자리 정보 */}
      {selectedSeat && (
        <div className="max-w-md mx-auto mt-8 p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">{selectedSeat.seatNumber}번 자리</h3>
            <Badge 
              variant={selectedSeat.isReserved ? 'destructive' : selectedSeat.isAvailable ? 'default' : 'secondary'}
            >
              {getSeatStatus(selectedSeat)}
            </Badge>
          </div>

          {selectedSeat.isReserved ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">예약자: {selectedSeat.reservedBy}</p>
              <p className="text-sm text-muted-foreground">
                예약 시간: {selectedSeat.reservationTime?.toLocaleString('ko-KR')}
              </p>
              {state.currentUser?.name === selectedSeat.reservedBy && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    dispatch({ type: 'CANCEL_RESERVATION', payload: selectedSeat.id });
                    dispatch({ type: 'SELECT_SEAT', payload: null });
                  }}
                  className="w-full"
                >
                  예약 취소
                </Button>
              )}
            </div>
          ) : selectedSeat.isAvailable && state.currentUser ? (
            <SeatReservationDialog seat={selectedSeat} />
          ) : !state.currentUser ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              자리를 예약하려면 먼저 로그인하세요.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              이 자리는 현재 사용할 수 없습니다.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'SELECT_SEAT', payload: null })}
            className="w-full mt-3"
          >
            선택 해제
          </Button>
        </div>
      )}
    </div>
  );
}