import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
}

interface CollaboratorPresence {
  userId: string;
  userName: string;
  color: string;
  online_at: string;
}

export function useRealtimeCollaboration(canvasId: string, userId: string, userName: string) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [userColor] = useState(() => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  useEffect(() => {
    const channelName = `canvas:${canvasId}`;

    const realtimeChannel = supabase.channel(channelName, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    realtimeChannel
      .on('presence', { event: 'sync' }, () => {
        const state = realtimeChannel.presenceState();
        const users: CollaboratorPresence[] = [];

        Object.keys(state).forEach((key) => {
          const presence = state[key][0] as CollaboratorPresence;
          if (presence.userId !== userId) {
            users.push(presence);
          }
        });

        setCollaborators(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        setCursors((prev) => {
          const updated = new Map(prev);
          updated.delete(key);
          return updated;
        });
      })
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        const cursorData = payload as CursorPosition;
        if (cursorData.userId !== userId) {
          setCursors((prev) => {
            const updated = new Map(prev);
            updated.set(cursorData.userId, cursorData);
            return updated;
          });
        }
      })
      .on('broadcast', { event: 'canvas-update' }, ({ payload }) => {
        console.log('Canvas update received:', payload);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await realtimeChannel.track({
            userId,
            userName,
            color: userColor,
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [canvasId, userId, userName, userColor]);

  const sendCursorPosition = (x: number, y: number) => {
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'cursor',
        payload: {
          userId,
          userName,
          x,
          y,
          color: userColor,
        },
      });
    }
  };

  const broadcastCanvasUpdate = (elements: any) => {
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'canvas-update',
        payload: {
          userId,
          elements,
          timestamp: Date.now(),
        },
      });
    }
  };

  return {
    cursors: Array.from(cursors.values()),
    collaborators,
    sendCursorPosition,
    broadcastCanvasUpdate,
    userColor,
  };
}
