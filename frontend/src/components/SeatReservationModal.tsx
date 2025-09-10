import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, Clock, X } from 'lucide-react';
import { useStudyRoom, Seat } from '../contexts/StudyRoomContext';

interface SeatReservationModalProps {
  seat: Seat;
  isOpen: boolean;
  onClose: () => void;
}

export function SeatReservationModal({ seat, isOpen, onClose }: SeatReservationModalProps) {
  const { state, dispatch } = useStudyRoom();
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
    return now.toTimeString().slice(0, 5);
  });
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
    now.setHours(now.getHours() + 2);
    return now.toTimeString().slice(0, 5);
  });
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const handleReservation = () => {
    if (!state.currentUser) return;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (endDateTime <= startDateTime) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }

    dispatch({
      type: 'RESERVE_SEAT',
      payload: {
        seatId: seat.id,
        user: state.currentUser,
        startTime: startDateTime,
        endTime: endDateTime,
      }
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-background rounded-t-3xl max-h-[80vh] overflow-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {seat.seatNumber}번 자리 예약
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 날짜 선택 */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                날짜
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="text-base p-4"
              />
            </div>

            {/* 시간 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time" className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4" />
                  시작 시간
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  step="1800"
                  className="text-base p-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-base">종료 시간</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  step="1800"
                  className="text-base p-4"
                />
              </div>
            </div>

            {/* 예약 정보 요약 */}
            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-medium mb-2">예약 정보</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  📅 {new Date(`${date}T${startTime}`).toLocaleDateString('ko-KR')}
                </div>
                <div>
                  ⏰ {new Date(`${date}T${startTime}`).toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} ~ {new Date(`${date}T${endTime}`).toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div>
                  👤 {state.currentUser?.name}
                </div>
                <div>
                  🪑 {seat.seatNumber}번 자리
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 py-3"
              >
                취소
              </Button>
              <Button
                onClick={handleReservation}
                className="flex-1 py-3"
              >
                예약 확정
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}