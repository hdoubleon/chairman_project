import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Clock, User, Trash2 } from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

export function ReservationPanel() {
  const { state, dispatch } = useStudyRoom();

  const reservationEntries = Object.entries(state.reservations);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isCurrentUserReservation = (reservation: any) => {
    return state.currentUser && reservation.user.id === state.currentUser.id;
  };

  const cancelReservation = (seatId: string) => {
    dispatch({ type: 'CANCEL_RESERVATION', payload: seatId });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="mb-2">전체 예약 현황</h3>
        <p className="text-sm text-muted-foreground">
          총 {reservationEntries.length}개의 예약이 있습니다.
        </p>
      </div>

      {reservationEntries.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">현재 예약이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservationEntries.map(([seatId, reservation]) => {
            const seat = state.seats.find(s => s.id === seatId);
            const isUserReservation = isCurrentUserReservation(reservation);
            
            return (
              <div
                key={seatId}
                className={`p-3 rounded-lg border ${
                  isUserReservation 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={reservation.user.avatar} />
                      <AvatarFallback>
                        {reservation.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{reservation.user.name}</span>
                        {isUserReservation && (
                          <Badge variant="outline" className="text-xs">내 예약</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span>#{seat?.seatNumber}번 자리</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(reservation.startTime)} ~ {formatTime(reservation.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {isUserReservation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelReservation(seatId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.currentUser && (
        <div className="mt-6 p-3 bg-accent rounded-lg">
          <h4 className="mb-2 flex items-center gap-1">
            <User className="w-4 h-4" />
            내 예약 현황
          </h4>
          
          {reservationEntries.filter(([_, reservation]) => 
            isCurrentUserReservation(reservation)
          ).length === 0 ? (
            <p className="text-sm text-muted-foreground">현재 예약된 자리가 없습니다.</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {reservationEntries.filter(([_, reservation]) => 
                isCurrentUserReservation(reservation)
              ).length}개의 자리를 예약했습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}