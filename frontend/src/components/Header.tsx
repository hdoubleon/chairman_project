import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Users, Settings } from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

export function Header() {
  const { state } = useStudyRoom();
  const currentTime = new Date().toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const availableSeats = state.seats.filter(seat => seat.isAvailable && !seat.isReserved).length;
  const reservedSeats = state.seats.filter(seat => seat.isReserved).length;

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl">📚 학교 자습실 관리</h1>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {currentTime}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500">
              사용 가능: {availableSeats}석
            </Badge>
            <Badge variant="default" className="bg-blue-500">
              예약됨: {reservedSeats}석
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              온라인: {Math.floor(Math.random() * 15) + 5}명
            </Badge>
            
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}