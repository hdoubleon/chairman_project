import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { MessageSquare, Users, Bell, Send, BookOpen, Coffee, Clock } from 'lucide-react';
import { useStudyRoom } from '../contexts/StudyRoomContext';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'notification';
}

interface StudyGroup {
  id: string;
  name: string;
  members: string[];
  subject: string;
  emoji: string;
}

export function CollaborationPanel() {
  const { state } = useStudyRoom();
  const [activeTab, setActiveTab] = useState<'chat' | 'groups' | 'notices'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('');

  // 모의 데이터
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: '김학생',
      message: '안녕하세요! 혹시 수학 공부하시는 분 계신가요?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'message'
    },
    {
      id: '2',
      user: '이공부',
      message: '저요! 미적분 문제 풀고 있어요',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: 'message'
    },
    {
      id: '3',
      user: 'System',
      message: '박준영님이 3번 자리를 예약했습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: 'notification'
    }
  ]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: '수학 스터디',
      members: ['김학생', '이공부', '박수학'],
      subject: '미적분학',
      emoji: '📐'
    },
    {
      id: '2',
      name: '영어 회화',
      members: ['최영어', '정회화'],
      subject: '토익 스피킹',
      emoji: '🗣️'
    }
  ]);

  const notices = [
    {
      id: '1',
      title: '자습실 이용 안내',
      content: '오후 6시부터 8시까지는 청소 시간입니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'info'
    },
    {
      id: '2',
      title: '그룹 스터디 모집',
      content: '컴퓨터 과학 알고리즘 스터디원을 모집합니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      type: 'study'
    }
  ];

  const sendMessage = () => {
    if (!newMessage.trim() || !state.currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: state.currentUser.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const createStudyGroup = () => {
    if (!newGroupName.trim() || !newGroupSubject.trim() || !state.currentUser) return;

    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      members: [state.currentUser.name],
      subject: newGroupSubject.trim(),
      emoji: '📚'
    };

    setStudyGroups(prev => [...prev, group]);
    setNewGroupName('');
    setNewGroupSubject('');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="mb-2">협업 도구</h3>
        <p className="text-sm text-muted-foreground">
          다른 학생들과 소통하고 함께 공부하세요.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex mb-4 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
            activeTab === 'chat'
              ? 'bg-background text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1" />
          채팅
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
            activeTab === 'groups'
              ? 'bg-background text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4 inline mr-1" />
          그룹
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
            activeTab === 'notices'
              ? 'bg-background text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-1" />
          공지
        </button>
      </div>

      {/* 채팅 탭 */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto border border-border rounded-lg p-3 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`${msg.type === 'notification' ? 'text-center' : ''}`}>
                {msg.type === 'notification' ? (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block">
                    {msg.message}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {msg.user.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {state.currentUser ? (
            <div className="flex gap-2">
              <Input
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              채팅에 참여하려면 로그인하세요.
            </p>
          )}
        </div>
      )}

      {/* 스터디 그룹 탭 */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {studyGroups.map((group) => (
              <div key={group.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{group.emoji}</span>
                  <h4 className="text-sm">{group.name}</h4>
                  <Badge variant="outline" className="ml-auto">
                    {group.members.length}명
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{group.subject}</p>
                <div className="flex items-center gap-1">
                  {group.members.slice(0, 3).map((member, idx) => (
                    <Avatar key={idx} className="w-5 h-5">
                      <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {group.members.length > 3 && (
                    <span className="text-xs text-muted-foreground ml-1">+{group.members.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {state.currentUser && (
            <div className="border-t border-border pt-4">
              <h4 className="mb-3 text-sm">새 스터디 그룹 만들기</h4>
              <div className="space-y-2">
                <Input
                  placeholder="그룹명"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Input
                  placeholder="주제 (예: 토익, 미적분학, 한국사)"
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                />
                <Button 
                  onClick={createStudyGroup}
                  size="sm"
                  className="w-full"
                  disabled={!newGroupName.trim() || !newGroupSubject.trim()}
                >
                  그룹 만들기
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 공지사항 탭 */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="p-3 border border-border rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notice.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <h4 className="text-sm">{notice.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{notice.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {notice.timestamp.toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}