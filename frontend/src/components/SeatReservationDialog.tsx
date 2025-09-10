import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, Clock } from 'lucide-react';
import { useStudyRoom, Seat } from '../contexts/StudyRoomContext';

interface SeatReservationDialogProps {
  seat: Seat;
}

export function SeatReservationDialog({ seat }: SeatReservationDialogProps) {
  const { state, dispatch } = useStudyRoom();
  const [isOpen, setIsOpen] = useState(false);
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

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          자리 예약하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{seat.seatNumber}번 자리 예약</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                날짜
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                시작 시간
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                step="1800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">종료 시간</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                step="1800"
              />
            </div>
          </div>

          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm">예약 정보</p>
            <p className="text-xs text-muted-foreground">
              {new Date(`${date}T${startTime}`).toLocaleString('ko-KR')} ~ {new Date(`${date}T${endTime}`).toLocaleString('ko-KR')}
            </p>
            <p className="text-xs text-muted-foreground">
              사용자: {state.currentUser?.name}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleReservation}
              className="flex-1"
            >
              예약 확정
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}