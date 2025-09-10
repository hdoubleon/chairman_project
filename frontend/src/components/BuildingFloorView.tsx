import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Clock, 
  Calendar,
  MapPin,
  Wifi,
  Power,
  Coffee
} from 'lucide-react';
import { Floor, Seat } from '../contexts/StudyRoomContext';
import { useStudyRoom } from '../contexts/StudyRoomContext';

interface BuildingFloorViewProps {
  floor: Floor;
  onSeatClick: (seatId: string) => void;
}

export function BuildingFloorView({ floor, onSeatClick }: BuildingFloorViewProps) {
  const { state } = useStudyRoom();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const availableSeats = floor.seats.filter(seat => seat.isAvailable && !seat.isReserved).length;
  const reservedSeats = floor.seats.filter(seat => seat.isReserved).length;
  const totalSeats = floor.seats.length;

  const getSeatColor = (seat: Seat) => {
    if (selectedSeat === seat.id) return 'bg-yellow-500 border-yellow-600';
    if (seat.isReserved) return 'bg-blue-500 border-blue-600';
    if (!seat.isAvailable) return 'bg-red-500 border-red-600';
    return 'bg-green-500 border-green-600';
  };

  const getFloorFeatures = (layout: string) => {
    switch (layout) {
      case 'library':
        return [
          { icon: Wifi, name: 'Wi-Fi' },
          { icon: Power, name: '개인 콘센트' },
          { icon: Users, name: '조용한 환경' }
        ];
      case 'classroom':
        return [
          { icon: Wifi, name: 'Wi-Fi' },
          { icon: Power, name: '전원 공급' },
          { icon: MapPin, name: '프로젝터' }
        ];
      case 'study-room':
        return [
          { icon: Wifi, name: 'Wi-Fi' },
          { icon: Power, name: '콘센트' },
          { icon: Coffee, name: '음료 허용' }
        ];
      default:
        return [];
    }
  };

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat.id);
  };

  const selectedSeatData = floor.seats.find(seat => seat.id === selectedSeat);
  const features = getFloorFeatures(floor.layout);

  return (
    <div className="space-y-4">
      {/* 층 정보 카드 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{floor.name}</CardTitle>
            <Badge variant="outline">
              {floor.layout === 'library' ? '도서관' : 
               floor.layout === 'classroom' ? '강의실' : '자습실'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">{availableSeats}</div>
              <div className="text-xs text-muted-foreground">사용 가능</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600">{reservedSeats}</div>
              <div className="text-xs text-muted-foreground">예약됨</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">{totalSeats}</div>
              <div className="text-xs text-muted-foreground">전체</div>
            </div>
          </div>

          {/* 시설 정보 */}
          {features.length > 0 && (
            <div className="flex justify-center gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <feature.icon className="w-3 h-3" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 자리 배치도 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">자리 배치도</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 교단/강단 표시 (도서관이 아닌 경우) */}
          {floor.layout !== 'library' && (
            <div className="flex justify-center mb-4">
              <div className="bg-accent px-4 py-2 rounded-lg">
                <span className="text-xs font-medium">
                  {floor.layout === 'classroom' ? '🎓 강단' : '📋 안내데스크'}
                </span>
              </div>
            </div>
          )}

          {/* 자리 그리드 */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {floor.seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                className={`
                  aspect-square p-1 rounded-md border-2 transition-all duration-200
                  ${getSeatColor(seat)} text-white text-xs
                  ${selectedSeat === seat.id ? 'scale-105 shadow-lg' : ''}
                  active:scale-95
                `}
              >
                <div className="text-center">
                  <div className="font-medium text-xs">{seat.seatNumber}</div>
                </div>
              </button>
            ))}
          </div>

          {/* 범례 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded border"></div>
              <span>사용 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded border"></div>
              <span>예약됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded border"></div>
              <span>사용 불가</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded border"></div>
              <span>선택됨</span>
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
                {selectedSeatData.isReserved ? '예약됨' : selectedSeatData.isAvailable ? '사용가능' : '사용불가'}
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
              </div>
            ) : selectedSeatData.isAvailable ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  이 자리를 예약하시겠습니까?
                </p>
                <Button
                  onClick={() => onSeatClick(selectedSeatData.id)}
                  className="w-full"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  자리 예약하기
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
  );
}