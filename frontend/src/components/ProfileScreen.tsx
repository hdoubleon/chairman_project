import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

type Screen = 'home' | 'map' | 'reservation' | 'profile' | 'building';

interface ProfileScreenProps {
  onNavigate: (screen: Screen, buildingId?: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { state, dispatch } = useStudyRoom();
  const [name, setName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const userReservations = Object.entries(state.reservations).filter(
    ([_, reservation]) => state.currentUser && reservation.user.id === state.currentUser.id
  );

  const activeReservations = userReservations.filter(([_, reservation]) => {
    const now = new Date();
    return reservation.endTime > now;
  });

  if (!state.currentUser) {
    return (
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">환영합니다!</h2>
            <p className="text-muted-foreground">
              자습실을 이용하려면 로그인해주세요.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">로그인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">이름</label>
                <Input
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="text-base p-4"
                />
              </div>
              
              <Button 
                onClick={handleLogin} 
                disabled={!name.trim()}
                className="w-full py-3"
              >
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                로그인하여 자리를 예약하고 다른 학생들과 소통하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* 사용자 프로필 */}
      <div className="p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl">
                  {state.currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-xl font-medium">{state.currentUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    온라인
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 예약 현황 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">예약 현황</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('reservation')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {activeReservations.length}
                </div>
                <div className="text-sm text-muted-foreground">활성 예약</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold">
                  {userReservations.length}
                </div>
                <div className="text-sm text-muted-foreground">총 예약</div>
              </div>
            </div>
            
            {activeReservations.length > 0 && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">
                    현재 {activeReservations.length}개의 활성 예약이 있습니다
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 메뉴 */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto"
            onClick={() => onNavigate('reservation')}
          >
            <Calendar className="w-5 h-5 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">내 예약</div>
              <div className="text-sm text-muted-foreground">예약 내역 및 관리</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto"
            onClick={() => onNavigate('map')}
          >
            <Clock className="w-5 h-5 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">자습실 현황</div>
              <div className="text-sm text-muted-foreground">실시간 자리 정보</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto"
          >
            <Bell className="w-5 h-5 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">알림 설정</div>
              <div className="text-sm text-muted-foreground">예약 알림 및 공지사항</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 mr-3" />
            ) : (
              <Moon className="w-5 h-5 mr-3" />
            )}
            <div className="flex-1 text-left">
              <div className="font-medium">테마 설정</div>
              <div className="text-sm text-muted-foreground">
                {isDarkMode ? '라이트 모드' : '다크 모드'}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto"
          >
            <Settings className="w-5 h-5 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">설정</div>
              <div className="text-sm text-muted-foreground">앱 설정 및 도움말</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        {/* 앱 정보 */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            서울과학기술대학교 자습실 관리 앱
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            버전 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}