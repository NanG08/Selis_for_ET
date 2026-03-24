import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { askSelisAI } from '../lib/gemini';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';

export default function AIChat({ user }: { user: any }) {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: `Hello ${user.name}! I'm Sally. How can I help you with your ${user.plan} finances today?`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const [txs, bgs] = await Promise.all([
        api.transactions.getAll(),
        api.budgets.getAll()
      ]);
      
      const context = {
        plan: user.plan,
        data: { transactions: txs, budgets: bgs }
      };

      const aiResponse = await askSelisAI(input, context);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm sorry, I encountered an error. Please try again.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-emerald-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white p-1.5 rounded-xl border border-neutral-100 shadow-sm">
            <img 
              src="/logo.png" 
              alt="Sally" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Sally Assistant</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Sparkles size={10} />
              Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                  msg.sender === 'user' ? 'bg-neutral-100 text-neutral-600' : 'bg-white border border-neutral-100'
                }`}>
                  {msg.sender === 'user' ? (
                    <User size={16} />
                  ) : (
                    <img 
                      src="/logo.png" 
                      alt="Sally" 
                      className="w-5 h-5 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-500 text-white rounded-tr-none' 
                    : 'bg-neutral-50 text-neutral-800 rounded-tl-none border border-neutral-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Sally" 
                  className="w-5 h-5 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-emerald-500" />
                <span className="text-xs text-neutral-500 font-medium">Sally is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-6 border-t border-neutral-100 bg-neutral-50/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your finances..."
            className="w-full pl-6 pr-14 py-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
          Sally can make mistakes. Verify important financial decisions.
        </p>
      </form>
    </div>
  );
}
