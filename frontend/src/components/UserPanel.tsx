import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { User, LogIn, LogOut } from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

export function UserPanel() {
  const { state, dispatch } = useStudyRoom();
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      dispatch({
        type: 'SET_USER',
        payload: {
          id: `user-${Date.now()}`,
          name: name.trim(),
        }
      });
      setName('');
    }
  };

  const handleLogout = () => {
    dispatch({
      type: 'SET_USER',
      payload: null as any
    });
  };

  if (!state.currentUser) {
    return (
      <div className="p-4 border-b border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">사용자 로그인</span>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="flex-1"
            />
            <Button onClick={handleLogin} size="sm" disabled={!name.trim()}>
              <LogIn className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            로그인하여 자리를 예약하고 다른 사용자와 협업하세요.
          </p>
        </div>
      </div>
    );
  }

  // 사용자가 예약한 자리 찾기
  const userReservation = Object.entries(state.reservations).find(
    ([_, reservation]) => reservation.user.id === state.currentUser?.id
  );

  return (
    <div className="p-4 border-b border-border">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={state.currentUser.avatar} />
              <AvatarFallback>
                {state.currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">{state.currentUser.name}</p>
              <Badge variant="outline" className="text-xs">온라인</Badge>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
        {userReservation && (
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm">현재 예약</p>
            <p className="text-xs text-muted-foreground">
              {state.seats.find(seat => seat.id === userReservation[0])?.seatNumber}번 자리
            </p>
            <p className="text-xs text-muted-foreground">
              {userReservation[1].startTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} ~ {userReservation[1].endTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}