'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X, User, AlertCircle, BookOpen } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'How do I compare products?',
  'Where can I manage my account?',
  'Can I make a real payment?',
];

const INITIAL_MESSAGES = [{
  id: 'welcome',
  sender: 'assistant',
  text: 'Ask about product discovery, account features, comparison or the demo checkout. Answers are retrieved from the storefront knowledge base.',
  sources: [],
}];

export default function AiChatWidget() {
  const [isOpen,setIsOpen]=useState(false);
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState(INITIAL_MESSAGES);
  const [isTyping,setIsTyping]=useState(false);
  const [error,setError]=useState('');
  const bottomRef=useRef(null);

  useEffect(()=>{if(isOpen)bottomRef.current?.scrollIntoView({behavior:'smooth',block:'end'})},[messages,isOpen,isTyping]);

  const sendMessage=async(value=input)=>{
    const query=value.trim();
    if(!query||isTyping)return;
    const userMessage={id:'u-'+Date.now(),sender:'user',text:query,sources:[]};
    setMessages(current=>[...current,userMessage]);
    setInput('');
    setError('');
    setIsTyping(true);
    try{
      const response=await fetch('/api/support/query',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query}),
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.detail||data.message||data.error?.message||'The knowledge service is unavailable.');
      if(!data.answer)throw new Error('The knowledge service returned an empty answer.');
      setMessages(current=>[...current,{
        id:'a-'+Date.now(),
        sender:'assistant',
        text:data.answer,
        sources:(data.relevantContext||[]).map(item=>item.category).filter(Boolean).filter((item,index,all)=>all.indexOf(item)===index),
      }]);
    }catch(err){
      setError(err.message||'Unable to reach the knowledge service. Check that the RAG service is running.');
    }finally{
      setIsTyping(false);
    }
  };

  return <>
    <button type="button" onClick={()=>setIsOpen(value=>!value)} aria-label={isOpen?'Close storefront assistant':'Open storefront assistant'} aria-expanded={isOpen} className="fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-2 bg-[#315b49] px-4 text-white shadow-[0_12px_35px_rgba(28,41,36,.22)] transition hover:bg-[#214635] focus:outline-none focus:ring-2 focus:ring-[#829b88] focus:ring-offset-2">
      {isOpen?<X size={19}/>:<Sparkles size={19}/>}<span className="text-[10px] font-bold uppercase tracking-[.14em]">{isOpen?'Close':'Ask the assistant'}</span>
    </button>
    {isOpen&&<section aria-label="Storefront knowledge assistant" className="fixed bottom-24 right-3 z-50 flex h-[min(620px,calc(100dvh-130px))] w-[calc(100%-24px)] max-w-[390px] flex-col overflow-hidden border border-[#d9ddd4] bg-[#fffefa] shadow-[0_24px_70px_rgba(28,41,36,.22)] sm:right-5">
      <header className="flex items-center justify-between border-b border-[#e5e4dc] bg-[#f4f4ee] px-4 py-4">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-[#315b49] text-white"><Bot size={20}/></span><div><h2 className="text-sm font-semibold text-[#1c2924]">Storefront assistant</h2><p className="mt-1 text-[10px] text-[#788078]">Retrieval-backed answers · Knowledge base</p></div></div>
        <button type="button" onClick={()=>setIsOpen(false)} aria-label="Close assistant" className="grid h-9 w-9 place-items-center text-[#788078] hover:bg-[#e8eee7] hover:text-[#315b49]"><X size={17}/></button>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#fafaf6] p-4">
        {messages.map(message=><div key={message.id} className={'flex gap-2 '+(message.sender==='user'?'justify-end':'justify-start')}>
          {message.sender==='assistant'&&<span className="mt-1 grid h-7 w-7 shrink-0 place-items-center bg-[#e8eee7] text-[#315b49]"><Bot size={14}/></span>}
          <div className="max-w-[86%]"><div className={'px-3.5 py-3 text-xs leading-6 '+(message.sender==='user'?'bg-[#315b49] text-white':'border border-[#e5e4dc] bg-white text-[#43534a]')}>{message.text}</div>
            {message.sources?.length>0&&<div className="mt-2 flex flex-wrap gap-1.5">{message.sources.map(source=><span key={source} className="inline-flex items-center gap-1 border border-[#e5e4dc] bg-[#f4f4ee] px-2 py-1 text-[9px] text-[#788078]"><BookOpen size={10}/>{source}</span>)}</div>}
          </div>
          {message.sender==='user'&&<span className="mt-1 grid h-7 w-7 shrink-0 place-items-center bg-[#e9e9e2] text-[#59665e]"><User size={14}/></span>}
        </div>)}
        {isTyping&&<div className="flex items-center gap-2 text-[11px] text-[#879087]"><span className="h-2 w-2 animate-pulse bg-[#829b88]"/><span>Searching the knowledge base…</span></div>}
        {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-3 text-[11px] leading-5 text-[#9b5147]"><AlertCircle size={14} className="mt-0.5 shrink-0"/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div className="border-t border-[#e5e4dc] bg-white p-3">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{QUICK_SUGGESTIONS.map(suggestion=><button key={suggestion} type="button" onClick={()=>sendMessage(suggestion)} disabled={isTyping} className="shrink-0 border border-[#e5e4dc] px-2.5 py-2 text-[9px] text-[#59665e] hover:border-[#829b88] hover:text-[#315b49] disabled:opacity-40">{suggestion}</button>)}</div>
        <form onSubmit={event=>{event.preventDefault();sendMessage()}} className="flex items-center gap-2"><input value={input} onChange={event=>setInput(event.target.value)} disabled={isTyping} placeholder="Ask about this storefront…" aria-label="Message the storefront assistant" className="h-11 min-w-0 flex-1 border border-[#dedfd6] bg-[#fafaf6] px-3 text-xs text-[#27362e] outline-none placeholder:text-[#a0a89f] focus:border-[#829b88]"/><button type="submit" disabled={!input.trim()||isTyping} aria-label="Send message" className="grid h-11 w-11 shrink-0 place-items-center bg-[#315b49] text-white hover:bg-[#214635] disabled:cursor-not-allowed disabled:opacity-40"><Send size={16}/></button></form>
        <p className="mt-2 text-[9px] text-[#9aa198]">Answers are retrieved from the configured knowledge base, not generated recommendations.</p>
      </div>
    </section>}
  </>;
}