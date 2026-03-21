/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ActivityConfig } from './types';
import { Bot, ChevronRight, Save, Send, User, Paperclip, Mic } from 'lucide-react';
import BasicInfoForm from './components/BasicInfoForm';

export default function App() {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: '您好！我是您的活动配置助手。您可以问我如何设置激励政策，或者让我帮您优化活动主题。' }
  ]);
  const [input, setInput] = useState('');
  const [config, setConfig] = useState<ActivityConfig>({
    basicInfo: {
      serviceFeePayer: 'chain',
      industry: '',
      theme: '',
      incentiveMode: 'immediate',
      incentiveCalculation: 'quantity',
      incentiveDistribution: '',
      targetId: '',
      startTime: '',
      endTime: '',
      cover: '',
      summary: ''
    },
    incentivePolicy: { policies: [] },
    products: [],
    stores: []
  });

  const steps = ['创建活动信息', '配置激励政策', '活动商品', '活动门店'];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    // 这里后续将接入 Gemini API
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `收到您的指令：“${input}”。基于您当前填写的活动主题“${config.basicInfo.theme || '未填写'}”，建议...` }]);
    }, 500);
    setInput('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoForm config={config} onChange={setConfig} />;
      default:
        return <p className="text-gray-500 text-center py-20">当前步骤：{steps[step - 1]}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">代厂家建活动</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">仅保存</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} /> 保存并设置政策
            </button>
          </div>
        </header>

        <div className="px-6 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${i + 1 === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i + 1 === step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <ChevronRight size={16} className="text-gray-400 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {renderStep()}
          </div>
        </div>
      </main>

      <aside className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 font-medium">
          <Bot className="text-blue-600" /> AI 智能助手
        </div>
        
        {/* 消息列表 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'ai' ? 'bg-gray-100' : 'bg-blue-600 text-white'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 输入框 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2 mb-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg" title="上传附件">
              <Paperclip size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg" title="语音输入">
              <Mic size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="输入您的问题..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg">
              <Send size={16} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
