import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  MapPin, 
  Users, 
  Clock,
  Calendar,
  Filter,
  RefreshCw 
} from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';
import { SeatReservationModal } from './SeatReservationModal';

type Screen = 'home' | 'map' | 'reservation' | 'profile' | 'building';

interface MapScreenProps {
  onNavigate: (screen: Screen, buildingId?: string) => void;
}

export function MapScreen({ onNavigate }: MapScreenProps) {
  const { state, dispatch } = useStudyRoom();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved'>('all');

  const filteredSeats = state.seats.filter(seat => {
    switch (filter) {
      case 'available':
        return seat.isAvailable && !seat.isReserved;
      case 'reserved':
        return seat.isReserved;
      default:
        return true;
    }
  });

  const getSeatColor = (seat: any) => {
    if (selectedSeat === seat.id) return 'bg-yellow-500 border-yellow-600';
    if (seat.isReserved) return 'bg-blue-500 border-blue-600';
    if (!seat.isAvailable) return 'bg-red-500 border-red-600';
    return 'bg-green-500 border-green-600';
  };

  const getSeatStatus = (seat: any) => {
    if (seat.isReserved) return '예약됨';
    if (!seat.isAvailable) return '사용불가';
    return '사용가능';
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    const seat = state.seats.find(s => s.id === seatId);
    if (seat?.isAvailable && !seat.isReserved && state.currentUser) {
      setShowReservationModal(true);
    }
  };

  const selectedSeatData = state.seats.find(seat => seat.id === selectedSeat);

  return (
    <div className="flex-1 flex flex-col">
      {/* 필터 및 새로고침 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">자습실 지도</h2>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            전체
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('available')}
          >
            사용 가능
          </Button>
          <Button
            variant={filter === 'reserved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('reserved')}
          >
            예약됨
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* 교단 */}
        <div className="flex justify-center mb-6">
          <div className="bg-accent px-6 py-3 rounded-lg">
            <span className="text-sm font-medium">🎓 교단</span>
          </div>
        </div>

        {/* 자리 배치도 */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {filteredSeats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
              className={`
                aspect-square p-2 rounded-lg border-2 transition-all duration-200
                ${getSeatColor(seat)} text-white text-xs
                ${selectedSeat === seat.id ? 'scale-105 shadow-lg' : ''}
                active:scale-95
              `}
            >
              <div className="text-center">
                <div className="font-medium">#{seat.seatNumber}</div>
                <div className="text-xs opacity-80 mt-1">
                  {seat.isReserved ? '예약' : seat.isAvailable ? '가능' : '불가'}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 범례 */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">범례</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border"></div>
                <span className="text-sm">사용 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                <span className="text-sm">예약됨</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border"></div>
                <span className="text-sm">사용 불가</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                <span className="text-sm">선택됨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 선택된 자리 정보 */}
        {selectedSeatData && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {selectedSeatData.seatNumber}번 자리
                </CardTitle>
                <Badge 
                  variant={selectedSeatData.isReserved ? 'destructive' : selectedSeatData.isAvailable ? 'default' : 'secondary'}
                >
                  {getSeatStatus(selectedSeatData)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {selectedSeatData.isReserved ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>예약자: {selectedSeatData.reservedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      예약 시간: {selectedSeatData.reservationTime?.toLocaleString('ko-KR')}
                    </span>
                  </div>
                  {state.currentUser?.name === selectedSeatData.reservedBy && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        dispatch({ type: 'CANCEL_RESERVATION', payload: selectedSeatData.id });
                        setSelectedSeat(null);
                      }}
                      className="w-full mt-3"
                    >
                      예약 취소
                    </Button>
                  )}
                </div>
              ) : selectedSeatData.isAvailable && state.currentUser ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    이 자리를 예약하시겠습니까?
                  </p>
                  <Button
                    onClick={() => setShowReservationModal(true)}
                    className="w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    자리 예약하기
                  </Button>
                </div>
              ) : !state.currentUser ? (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    자리를 예약하려면 먼저 로그인하세요.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('profile')}
                  >
                    로그인하기
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  이 자리는 현재 사용할 수 없습니다.
                </p>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSeat(null)}
                className="w-full mt-3"
              >
                선택 해제
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 예약 모달 */}
      {showReservationModal && selectedSeatData && (
        <SeatReservationModal
          seat={selectedSeatData}
          isOpen={showReservationModal}
          onClose={() => {
            setShowReservationModal(false);
            setSelectedSeat(null);
          }}
        />
      )}
    </div>
  );
}