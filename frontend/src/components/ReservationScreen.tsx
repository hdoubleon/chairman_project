import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trash2,
  Plus,
  AlertCircle 
} from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

type Screen = 'home' | 'map' | 'reservation' | 'profile' | 'building';

interface ReservationScreenProps {
  onNavigate: (screen: Screen, buildingId?: string) => void;
}

export function ReservationScreen({ onNavigate }: ReservationScreenProps) {
  const { state, dispatch } = useStudyRoom();

  const userReservations = Object.entries(state.reservations).filter(
    ([_, reservation]) => state.currentUser && reservation.user.id === state.currentUser.id
  );

  const cancelReservation = (seatId: string) => {
    dispatch({ type: 'CANCEL_RESERVATION', payload: seatId });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    return date < new Date();
  };

  if (!state.currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium mb-2">로그인이 필요합니다</h2>
          <p className="text-muted-foreground mb-6">
            예약 내역을 확인하려면 먼저 로그인해주세요.
          </p>
          <Button onClick={() => onNavigate('profile')}>
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">내 예약</h2>
            <p className="text-sm text-muted-foreground">
              총 {userReservations.length}개의 예약이 있습니다
            </p>
          </div>
          <Button 
            size="sm"
            onClick={() => onNavigate('map')}
          >
            <Plus className="w-4 h-4 mr-1" />
            새 예약
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {userReservations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">예약이 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                자습실 지도에서 빈 자리를 찾아 예약해보세요.
              </p>
              <Button onClick={() => onNavigate('map')}>
                <MapPin className="w-4 h-4 mr-2" />
                자리 찾기
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {userReservations.map(([seatId, reservation]) => {
              const seat = state.seats.find(s => s.id === seatId);
              const startDate = reservation.startTime;
              const endDate = reservation.endTime;
              const isExpired = isPast(endDate);
              const isActive = !isPast(startDate) && !isPast(endDate);
              
              return (
                <Card key={seatId} className={isExpired ? 'opacity-60' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {seat?.seatNumber}번 자리
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={isExpired ? 'secondary' : isActive ? 'default' : 'outline'}
                          >
                            {isExpired ? '종료됨' : isActive ? '진행중' : '예정'}
                          </Badge>
                          {isToday(startDate) && (
                            <Badge variant="outline" className="text-xs">
                              오늘
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!isExpired && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelReservation(seatId)}
                          className="text-destructive hover:text-destructive p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(startDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatTime(startDate)} ~ {formatTime(endDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>자습실 {seat?.seatNumber}번</span>
                      </div>
                      
                      {isActive && (
                        <div className="flex items-center gap-2 text-sm text-green-600 mt-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>현재 이용 중</span>
                        </div>
                      )}
                      
                      {isPast(startDate) && !isPast(endDate) && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 mt-3">
                          <AlertCircle className="w-4 h-4" />
                          <span>이용 시간이 시작되었습니다</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}