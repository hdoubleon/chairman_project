import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext.jsx';
import { BuildingFloorView } from './BuildingFloorView';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BuildingDetailScreen({ onNavigate, buildingId }) {
  const { state, dispatch } = useStudyRoom();
  const [selectedFloorDropdown, setSelectedFloorDropdown] = useState(null);

  const building = state.buildings.find(b => b.id === buildingId);
  
  if (!building) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">건물을 찾을 수 없습니다.</p>
          <Button 
            onClick={() => onNavigate('home')}
            className="mt-4"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 첫 번째 층을 기본 선택
  const currentFloorId = state.selectedFloor || building.floors[0]?.id;
  const selectedFloor = building.floors.find(f => f.id === currentFloorId);

  const handleFloorSelect = (floorId) => {
    dispatch({ type: 'SELECT_FLOOR', payload: floorId });
    setSelectedFloorDropdown(null);
  };

  const handleSeatClick = (seatId) => {
    dispatch({ type: 'SELECT_SEAT', payload: seatId });
    onNavigate('map');
  };

  const getBuildingIcon = (buildingCode) => {
    switch (buildingCode) {
      case 'MR': return '🏢';
      case 'LB': return '📚';
      case 'SS': return '🎨';
      default: return '🏫';
    }
  };

  const getBuildingImage = (buildingCode) => {
    switch (buildingCode) {
      case 'MR': return 'https://images.unsplash.com/photo-1600239401291-385542139183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU3Mzk3MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      case 'LB': return 'https://images.unsplash.com/photo-1656849093660-f672e7dabaca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYnVpbGRpbmclMjBtb2Rlcm58ZW58MXx8fHwxNzU3NDkxNDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      case 'SS': return 'https://images.unsplash.com/photo-1707109463055-05893850bbfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydHMlMjBidWlsZGluZyUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzU3NDkxNDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      default: return 'https://images.unsplash.com/photo-1600239401291-385542139183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU3Mzk3MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* 건물 이미지 헤더 */}
      <div className="relative">
        <ImageWithFallback
          src={getBuildingImage(building.code)}
          alt={`${building.name} 건물`}
          className="w-full h-48 object-cover"
        />
        
        {/* 건물명 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h1 className="text-white text-2xl font-medium">{building.name}</h1>
        </div>
      </div>

      <div className="p-4">
        {/* 층 선택 섹션 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">층별 현황</h2>
        </div>

        {/* 층별 원형 그래프 섹션 */}
        <div className="flex gap-6 justify-center mb-6">
          {building.floors.map((floor) => {
            const available = floor.seats.filter(seat => seat.isAvailable && !seat.isReserved).length;
            const total = floor.seats.length;
            const percent = total === 0 ? 0 : available / total;
            const selected = selectedFloor && selectedFloor.id === floor.id;
            const radius = 28;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - percent);
            return (
              <div
                key={floor.id}
                className={`rounded-xl p-3 flex flex-col items-center cursor-pointer transition-colors duration-200 border ${selected ? 'bg-gray-100 border-blue-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                onClick={() => handleFloorSelect(floor.id)}
                style={{ minWidth: 90 }}
              >
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <g transform="rotate(-90 32 32)">
                    <circle cx="32" cy="32" r="28" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke={selected ? '#2563eb' : '#22c55e'}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      style={{ transition: 'stroke-dashoffset 0.5s' }}
                    />
                  </g>
                  <text x="32" y="36" textAnchor="middle" fontSize="16" fill="#222">
                    {available}/{total}
                  </text>
                </svg>
                <div className={`mt-2 text-sm font-medium ${selected ? 'text-blue-600' : 'text-gray-700'}`}>{floor.number}F</div>
              </div>
            );
          })}
        </div>
        {/* 선택된 층의 상세 정보 */}
        {selectedFloor && (
          <BuildingFloorView 
            floor={selectedFloor}
            onSeatClick={handleSeatClick}
          />
        )}
      </div>
    </div>
  );
}