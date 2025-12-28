'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { messagesAPI } from '@/lib/api';
import { wsClient } from '@/lib/websocket';
import { FiSend, FiPaperclip, FiMoreVertical, FiSearch } from 'react-icons/fi';

export default function MessagesPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();

        // Connect WebSocket
        const token = localStorage.getItem('token');
        if (token) {
            wsClient.connect(token);

            wsClient.onMessage((message) => {
                setMessages((prev) => [...prev, message]);
            });
        }

        return () => {
            wsClient.disconnect();
        };
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await messagesAPI.getConversations();
            setConversations(response.data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = async (conv: any) => {
        setSelectedConversation(conv);

        try {
            const response = await messagesAPI.getMessages(conv.groupId, conv.sender?.id);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        wsClient.sendMessage({
            content: newMessage,
            groupId: selectedConversation.groupId,
            recipientId: selectedConversation.sender?.id,
        });

        setNewMessage('');
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="glass-card border-b border-dark-700">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-white">K</span>
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text">Konnect</span>
                    </Link>
                    <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
                </nav>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Conversations Sidebar */}
                <div className="w-80 glass-card border-r border-dark-700 flex flex-col">
                    <div className="p-4 border-b border-dark-700">
                        <h2 className="text-xl font-bold mb-3">Messages</h2>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="input-field pl-10 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p>No conversations yet</p>
                                <Link href="/discover" className="btn-primary mt-4 inline-block">
                                    Find Collaborators
                                </Link>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`w-full p-4 flex items-start space-x-3 hover:bg-dark-700/50 transition-colors border-b border-dark-700 ${selectedConversation?.id === conv.id ? 'bg-dark-700/50' : ''
                                        }`}
                                >
                                    <img
                                        src={conv.group?.avatar || conv.sender?.avatar}
                                        alt={conv.group?.name || conv.sender?.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold">{conv.group?.name || conv.sender?.name}</div>
                                        <div className="text-sm text-gray-400 line-clamp-1">{conv.content}</div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-dark-700 flex items-center justify-between glass-card">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={selectedConversation.group?.avatar || selectedConversation.sender?.avatar}
                                        alt={selectedConversation.group?.name || selectedConversation.sender?.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <div className="font-semibold">
                                            {selectedConversation.group?.name || selectedConversation.sender?.name}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {selectedConversation.group ? `${selectedConversation.group.memberCount} members` : 'Online'}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn-ghost">
                                    <FiMoreVertical />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((message) => (
                                    <div key={message.id} className="flex items-start space-x-3">
                                        <img
                                            src={message.sender?.avatar}
                                            alt={message.sender?.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">{message.sender?.name}</div>
                                            <div className="bg-dark-700/50 rounded-lg px-4 py-2 max-w-md">
                                                {message.content}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(message.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-dark-700 glass-card">
                                <div className="flex items-center space-x-3">
                                    <button className="btn-ghost">
                                        <FiPaperclip />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="input-field flex-1"
                                    />
                                    <button onClick={handleSendMessage} className="btn-primary">
                                        <FiSend />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💬</div>
                                <p className="text-xl">Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
