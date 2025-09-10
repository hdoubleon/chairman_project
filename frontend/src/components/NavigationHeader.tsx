import React from 'react';
import { Button } from './ui/button';
import { Map, ArrowLeft } from 'lucide-react';

type Screen = 'home' | 'map' | 'reservation' | 'profile' | 'building';

interface NavigationHeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, buildingId?: string) => void;
}

export function NavigationHeader({ currentScreen, onNavigate }: NavigationHeaderProps) {
  const getTitle = () => {
    switch (currentScreen) {
      case 'home':
        return '서울과학기술대학교';
      case 'map':
        return '자습실 지도';
      case 'reservation':
        return '내 예약';
      case 'profile':
        return '프로필';
      case 'building':
        return '건물 정보';
      default:
        return '서울과학기술대학교';
    }
  };

  const showBackButton = currentScreen !== 'home';
  const showMapButton = currentScreen === 'home';

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between relative">
      {/* 왼쪽 영역 */}
      <div className="flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="p-2 mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* 중앙 타이틀 */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-center text-lg font-medium">
          {getTitle()}
        </h1>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center">
        {showMapButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('map')}
            className="p-2"
          >
            <Map className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
}