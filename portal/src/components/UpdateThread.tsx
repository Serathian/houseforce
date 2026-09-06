'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Send, User, Shield } from 'lucide-react';

interface UpdateMessage {
  id: number;
  documentId: string;
  content: string;
  authorType: 'staff' | 'client';
  staffName?: string;
  createdAt: string;
}

interface UpdateThreadProps {
  updateId: number; // The Strapi ID of the update to relate the message to
  initialMessages?: UpdateMessage[];
  token: string;
}

export function UpdateThread({ updateId, initialMessages = [], token }: UpdateThreadProps) {
  const [messages, setMessages] = useState<UpdateMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      const res = await fetch(`${strapiUrl}/api/update-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            content: newMessage,
            authorType: 'client',
            update: updateId,
          }
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const createdMessage: UpdateMessage = {
          id: json.data.id,
          documentId: json.data.documentId,
          content: json.data.content,
          authorType: json.data.authorType,
          createdAt: json.data.createdAt,
        };
        setMessages((prev) => [...prev, createdMessage]);
        setNewMessage('');
      } else {
        console.error('Failed to post message', await res.text());
      }
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      {messages.length > 0 && (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Thread</h4>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-xl flex gap-4 ${
                msg.authorType === 'staff' 
                  ? 'bg-blue-50 border border-blue-100 ml-4' 
                  : 'bg-slate-50 border border-slate-100 mr-4'
              }`}
            >
              <div className="shrink-0 mt-1">
                {msg.authorType === 'staff' ? (
                  <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-800">
                    {msg.authorType === 'staff' ? msg.staffName || 'Staff' : 'You'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {format(parseISO(msg.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                <div className="text-slate-700 text-sm whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Reply to this update..."
          className="flex-1 rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px] resize-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newMessage.trim()}
          className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 shrink-0 self-end flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
