'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { groupsAPI, messagesAPI } from '@/lib/api';
import { FiUsers, FiSend, FiGrid, FiMoreVertical } from 'react-icons/fi';
import { useSocket } from '@/lib/websocket';

export default function GroupDetailPage() {
    const params = useParams();
    const socket = useSocket();
    const [group, setGroup] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchGroupDetails();
            fetchMessages();

            if (socket) {
                socket.emit('join_group', { groupId: params.id });

                socket.on('new_message', (msg: any) => {
                    if (msg.groupId === params.id) {
                        setMessages(prev => [...prev, msg]);
                    }
                });
            }
        }

        return () => {
            if (socket && params.id) {
                socket.emit('leave_group', { groupId: params.id });
                socket.off('new_message');
            }
        };
    }, [params.id, socket]);

    const fetchGroupDetails = async () => {
        try {
            const response = await groupsAPI.getById(params.id as string);
            setGroup(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await messagesAPI.getMessages(params.id as string);
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !socket) return;

        socket.emit('send_message', {
            groupId: params.id,
            content: newMessage,
        });
        setNewMessage('');
    };

    if (loading || !group) return <div className="p-10 text-center">Loading group...</div>;

    return (
        <div className="flex h-screen bg-dark-900">
            {/* Sidebar - Group Info */}
            <div className="w-80 border-r border-dark-700 bg-dark-800 p-6 hidden md:block">
                <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-dark-700 mx-auto mb-4 overflow-hidden">
                        {group.avatar && <img src={group.avatar} className="w-full h-full object-cover" />}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
                    <p className="text-gray-400 text-sm">{group.description}</p>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-8">
                    <button className="btn-secondary btn-sm">Invite</button>
                    <button className="btn-ghost btn-sm text-red-400">Leave</button>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-500 uppercase text-xs">Members ({group.memberCount})</h3>
                    {/* Mock members list */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500"></div>
                        <span>You</span>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-dark-700 flex items-center justify-between px-6 bg-dark-800/50 backdrop-blur">
                    <div className="font-bold">{group.name}</div>
                    <button className="md:hidden"><FiGrid /></button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-20">No messages yet. Start the conversation!</div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-3 rounded-lg ${msg.senderId === 'me' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-200'}`}>
                                <div className="text-xs opacity-50 mb-1">{msg.sender?.name}</div>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-dark-700 bg-dark-800">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 input-primary"
                        />
                        <button onClick={handleSendMessage} className="btn-primary p-3 rounded-lg">
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
