import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Clock } from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

type Screen = 'home' | 'map' | 'reservation' | 'profile' | 'building';

interface HomeScreenProps {
  onNavigate: (screen: Screen, buildingId?: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { state, dispatch } = useStudyRoom();

  const handleBuildingClick = (buildingId: string) => {
    dispatch({ type: 'SELECT_BUILDING', payload: buildingId });
    // 첫 번째 층을 자동 선택
    const building = state.buildings.find(b => b.id === buildingId);
    if (building && building.floors.length > 0) {
      dispatch({ type: 'SELECT_FLOOR', payload: building.floors[0].id });
    }
    // 새로운 화면으로 이동
    onNavigate('building', buildingId);
  };



  const getBuildingIcon = (buildingCode: string) => {
    switch (buildingCode) {
      case 'MR': return '🏢';
      case 'LB': return '📚';
      case 'SS': return '🎨';
      default: return '🏫';
    }
  };



  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4">
        {/* 건물 목록 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">공부 가능한 건물</h2>
          <div className="space-y-3">
            {state.buildings.map((building) => (
              <Card 
                key={building.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                onClick={() => handleBuildingClick(building.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getBuildingIcon(building.code)}
                      </div>
                      <div>
                        <div className="font-medium">{building.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {building.floors.length}개 층 · {building.totalSeats}석
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{building.operatingHours}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {building.availableSeats}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        사용 가능
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    {building.floors.map((floor) => {
                      const floorAvailable = floor.seats.filter(seat => seat.isAvailable && !seat.isReserved).length;
                      return (
                        <Badge 
                          key={floor.id}
                          variant={floorAvailable > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {floor.number}F: {floorAvailable}석
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}