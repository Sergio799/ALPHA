'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Loader2, Sparkles, User, BookUser, Copy, Check, ThumbsUp, ThumbsDown, Share2, RotateCcw, MoreHorizontal, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InputWithButton } from '@/components/ui/input-with-button';
import { Button } from '@/components/ui/button';
import { handleAdvisorChat } from './actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function MessageActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: text,
          title: 'Investment Advice from ALPHA',
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-gray-400 hover:text-white transition-all duration-300 backdrop-blur-md"
        title="Copy"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={handleLike}
        className={cn(
          "p-2 rounded-lg border transition-all duration-300 backdrop-blur-md",
          liked
            ? "bg-green-500/20 border-green-500/30 text-green-400"
            : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20 hover:text-white"
        )}
        title="Like"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      <button
        onClick={handleDislike}
        className={cn(
          "p-2 rounded-lg border transition-all duration-300 backdrop-blur-md",
          disliked
            ? "bg-red-500/20 border-red-500/30 text-red-400"
            : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20 hover:text-white"
        )}
        title="Dislike"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>

      <button
        onClick={handleShare}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-gray-400 hover:text-white transition-all duration-300 backdrop-blur-md"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      <button
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-gray-400 hover:text-white transition-all duration-300 backdrop-blur-md"
        title="Regenerate"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-gray-400 hover:text-white transition-all duration-300 backdrop-blur-md"
        title="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isPending) return;

    setError(undefined);
    setInput('');
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: currentInput },
    ];
    setMessages(newMessages);

    startTransition(async () => {
      try {
        const result = await handleAdvisorChat(newMessages);
        if (result.error) {
          setError(result.error);
        } else {
          setMessages(result.messages);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
            <BookUser className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-sans">AI Investment Advisor</h1>
            <p className="text-xs text-gray-400 font-sans">Personalized investment guidance</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="max-w-2xl w-full">
              <div className="p-8 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 w-fit mx-auto mb-8">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4 font-sans">What can I help with?</h2>
              <p className="text-gray-400 text-lg font-sans mb-16">
                Ask me about your portfolio, market trends, or investment strategies
              </p>
              <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full">
                <InputWithButton
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={isPending}
                  isLoading={isPending}
                  autoFocus
                />
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full py-6">
            {messages.map((message, index) => (
              <div key={index} className="py-4 px-6">
                <div className="flex gap-4">
                  <Avatar className="w-8 h-8 flex-shrink-0 mt-1 border border-white/20">
                    <AvatarFallback className={cn(
                      'text-white font-sans text-sm',
                      message.role === 'assistant' ? 'bg-primary/20 backdrop-blur-md' : 'bg-white/10 backdrop-blur-md'
                    )}>
                      {message.role === 'assistant' ? (
                        <Sparkles className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    {message.role === 'assistant' ? (
                      <div className="space-y-3">
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:my-3 font-sans prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-code:text-primary prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        <MessageActions text={message.content} />
                      </div>
                    ) : (
                      <p className="text-white font-sans whitespace-pre-wrap text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="border-t border-white/10 px-6 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm mb-3">
                <p className="text-sm text-red-400 font-sans">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="relative w-full">
              <InputWithButton
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={isPending}
                isLoading={isPending}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
