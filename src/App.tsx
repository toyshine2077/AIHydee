import React, { useState, useRef, useEffect } from 'react';
import { ActivityConfig } from './types';
import { Bot, ChevronRight, Save, Send, User, Paperclip, Mic, FileText, AlertTriangle, CheckCircle, Info, Sparkles, Edit3, BarChart2, Wand2 } from 'lucide-react';
import BasicInfoForm from './components/BasicInfoForm';
import IncentivePolicyForm from './components/IncentivePolicyForm';

type MessageType = 'text' | 'parsing_card' | 'options' | 'report' | 'comparison_lab';

interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
  type?: MessageType;
  data?: any;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init',
      role: 'ai', 
      text: 'Hi，我是您的激励助手。您可以直接告诉我您的策划意图（例如：“我想给正大天晴的感冒药做一个为期一个月的及时豆激励”），我会为您自动准备配置环境。',
      type: 'text'
    }
  ]);
  const [chatStage, setChatStage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 联想搜索框状态
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const allSuggestions = [
    '我要给华润三九做个活动，主推感冒灵',
    '春季感冒防范季',
    '高毛利商品主推激励',
    '清理近效期库存方案',
    '设置单品销售激励（按件奖励）'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) {
      setSuggestions(allSuggestions.filter(s => s.toLowerCase().includes(val.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSuggestions([]);

    if (chatStage === 1) {
      // 阶段二：参数自动化解构 -> 智能填充卡片
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '已为您自动识别并预填基本信息，请确认草稿：',
          type: 'parsing_card',
          data: { 
            details: [
              { label: '关联工业', value: '华润三九医药股份有限公司（已关联：厂家汇付账号）' },
              { label: '活动主题', value: '春季感冒防范季' },
              { label: '活动周期', value: '2026-03-30 至 2026-04-30（共32天）' },
              { label: '激励模式', value: '及时豆模式（即时发放，推荐）' },
              { label: '计算方式', value: '按商品数量计算' },
              { label: '关联商品', value: '已搜索到“三九感冒灵”相关品种 3 个' }
            ],
            options: ['全部加入并确认', '修改信息']
          }
        }]);
        setChatStage(2);
      }, 800);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '我正在学习更多指令，您可以继续使用快捷按钮进行配置。',
          type: 'text'
        }]);
      }, 500);
    }
  };

  const handleOptionSelect = (option: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      text: option
    }]);

    if (chatStage === 2 && option === '全部加入并确认') {
      // 阶段三：策略深度追问 -> 对比实验室
      setConfig(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          industry: '华润三九医药股份有限公司',
          theme: '春季感冒防范季',
          startTime: '2026-03-30',
          endTime: '2026-04-30',
          incentiveMode: 'immediate',
          incentiveCalculation: 'quantity'
        }
      }));

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '关于奖励：针对这款感冒灵，我为您模拟了两种激励方案的预估效果，您倾向于哪种？',
          type: 'comparison_lab',
          data: {
            planA: { name: '方案A：稳健型', reward: '5元/件', estSales: 1200, estCost: 6000, height: '60%' },
            planB: { name: '方案B：激进型', reward: '8元/件', estSales: 2500, estCost: 20000, height: '90%' },
            options: ['选择方案A (5元)', '选择方案B (8元)', '自定义金额']
          }
        }]);
        setChatStage(3);
      }, 800);
    } else if (chatStage === 3 && option.includes('选择方案')) {
      // 阶段三：策略深度追问 - 门槛
      const rewardAmount = option.includes('5元') ? '5' : '8';
      
      setTimeout(() => {
        // 同步配置到右侧：添加单品激励政策
        setConfig(prev => ({
          ...prev,
          incentivePolicy: {
            policies: [
              {
                id: Date.now(),
                typeId: 'single_product',
                typeName: '按商品激励',
                details: {
                  isTiered: false,
                  clerkReward: rewardAmount,
                  managerReward: '1',
                  regionalManagerReward: '',
                  chainReward: '',
                  thresholdType: 'percentage',
                  thresholdMin: '',
                  thresholdMax: ''
                }
              }
            ]
          }
        }));
        setStep(2); // 自动切换到政策配置页
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '关于门槛：为了保证利润，是否需要设置价格门槛？比如实付金额低于标价的 90% 就不发放激励了？',
          type: 'options',
          data: { options: ['低于标价90%不发', '不设置门槛'] }
        }]);
        setChatStage(4);
      }, 800);
    } else if (chatStage === 4) {
      // 阶段三：策略深度追问 - 氛围
      if (option === '低于标价90%不发') {
        setConfig(prev => {
          const newPolicies = [...prev.incentivePolicy.policies];
          if (newPolicies.length > 0 && newPolicies[0].details) {
            newPolicies[0].details.thresholdType = 'percentage';
            newPolicies[0].details.thresholdMin = '90';
            newPolicies[0].details.thresholdMax = '100';
          }
          return { ...prev, incentivePolicy: { policies: newPolicies } };
        });
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '关于氛围：我已为您生成了 3 张符合“春季感冒”主题的活动封面，您选一张，还是自己上传？',
          type: 'options',
          data: { options: ['使用封面1', '使用封面2', '使用封面3', '自己上传'] }
        }]);
        setChatStage(5);
      }, 600);
    } else if (chatStage === 5) {
      // 阶段四：实时仿真模拟 & 阶段五：配置审核与“一键生成” (包含魔法修改按钮)
      setTimeout(() => {
        setMessages(prev => [
          {
            id: Date.now().toString(),
            role: 'ai',
            text: '配置审核与“一键生成”',
            type: 'report',
            data: {
              summary: '工业（华润三九）、模式（及时豆）、计算（按数量）、发放（固定金额）。',
              risks: ['活动简介尚未填写，建议补充以提高店员参与意向', '活动开始时间为下周一，请确保服务费账户余额充足'],
              action: '点击“确认发布”，我将为您同时生成活动海报并推送至关联连锁的店员端。',
              options: ['确认发布', '再改改']
            }
          }
        ]);
        setChatStage(6);
      }, 800);
    } else if (chatStage === 6 && option === '确认发布') {
      handleDeploy();
    } else if (chatStage === 6 && (option === '力度加大' || option === '人群收窄')) {
      // 魔法修改按钮逻辑
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: `已为您执行魔法修改：【${option}】。右侧配置已实时更新，请确认。`,
          type: 'text'
        }]);
        
        if (option === '力度加大') {
          setConfig(prev => {
            const newPolicies = [...prev.incentivePolicy.policies];
            if (newPolicies.length > 0 && newPolicies[0].details) {
              newPolicies[0].details.clerkReward = (parseFloat(newPolicies[0].details.clerkReward || '0') + 2).toString();
            }
            return { ...prev, incentivePolicy: { policies: newPolicies } };
          });
        }
      }, 600);
    }
  };

  const handleDeploy = () => {
    alert('API 指令已发送，活动配置完成！海报已生成并推送。');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoForm config={config} onChange={setConfig} />;
      case 2:
        return <IncentivePolicyForm config={config} onChange={setConfig} />;
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
              <div key={s} className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(i + 1)}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${i + 1 === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i + 1 === step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <ChevronRight size={16} className="text-gray-400 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
            {renderStep()}
          </div>
          
          {/* 底部导航按钮 */}
          <div className="max-w-4xl mx-auto flex justify-between">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-6 py-2 border border-gray-300 rounded-lg text-sm ${step === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'hover:bg-gray-50'}`}
            >
              上一步
            </button>
            <button 
              onClick={() => setStep(Math.min(steps.length, step + 1))}
              disabled={step === steps.length}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg text-sm ${step === steps.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              下一步
            </button>
          </div>
        </div>
      </main>

      <aside className="w-[420px] bg-white border-l border-gray-200 flex flex-col relative">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 font-medium">
          <Bot className="text-blue-600" /> AI 智能助手
        </div>
        
        {/* 消息列表 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                
                {msg.text && (
                  <div className={`p-3 rounded-xl inline-block whitespace-pre-wrap text-[15px] leading-relaxed ${msg.role === 'ai' ? 'bg-gray-100 text-gray-800 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
                    {msg.text}
                  </div>
                )}
                
                {/* 智能填充卡片 (Smart Fill Card) */}
                {msg.type === 'parsing_card' && (
                  <div className="mt-2 bg-white border border-blue-200 rounded-xl p-4 text-sm shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="font-medium text-blue-800 mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-500" /> 智能填充草稿
                      </div>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs">
                        <Edit3 size={14} /> 编辑
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 text-gray-700 mb-4 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                      {msg.data.details.map((detail: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-gray-500 shrink-0">{detail.label}：</span>
                          <span className="font-medium">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                    {msg.data.options && chatStage === 2 && (
                      <div className="flex gap-2">
                        {msg.data.options.map((opt: string) => (
                          <button 
                            key={opt} 
                            onClick={() => handleOptionSelect(opt)} 
                            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${opt.includes('确认') ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 对比实验室 (Comparison Lab) */}
                {msg.type === 'comparison_lab' && (
                  <div className="mt-2 bg-white border border-indigo-200 rounded-xl p-4 text-sm shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="font-medium text-indigo-800 mb-4 flex items-center gap-2">
                      <BarChart2 size={16} className="text-indigo-500" /> 对比实验室
                    </div>
                    
                    <div className="flex gap-4 mb-5">
                      {/* 方案A */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-xs font-medium text-gray-700 mb-1">{msg.data.planA.name}</div>
                        <div className="text-indigo-600 font-bold mb-2">{msg.data.planA.reward}</div>
                        <div className="w-full h-24 bg-gray-50 rounded-t-md flex items-end justify-center border-b border-gray-200 relative">
                          <div 
                            className="w-10 bg-indigo-300 rounded-t-sm transition-all duration-1000 ease-out" 
                            style={{ height: msg.data.planA.height }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-2 text-center">
                          预估销量: {msg.data.planA.estSales}件<br/>
                          预估成本: ¥{msg.data.planA.estCost}
                        </div>
                      </div>
                      
                      {/* 方案B */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-xs font-medium text-gray-700 mb-1">{msg.data.planB.name}</div>
                        <div className="text-indigo-600 font-bold mb-2">{msg.data.planB.reward}</div>
                        <div className="w-full h-24 bg-gray-50 rounded-t-md flex items-end justify-center border-b border-gray-200 relative">
                          <div 
                            className="w-10 bg-indigo-500 rounded-t-sm transition-all duration-1000 ease-out" 
                            style={{ height: msg.data.planB.height }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-2 text-center">
                          预估销量: {msg.data.planB.estSales}件<br/>
                          预估成本: ¥{msg.data.planB.estCost}
                        </div>
                      </div>
                    </div>

                    {msg.data.options && chatStage === 3 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleOptionSelect(msg.data.options[0])} className="flex-1 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                            {msg.data.options[0]}
                          </button>
                          <button onClick={() => handleOptionSelect(msg.data.options[1])} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                            {msg.data.options[1]}
                          </button>
                        </div>
                        <button onClick={() => handleOptionSelect(msg.data.options[2])} className="w-full py-1.5 text-gray-500 hover:text-gray-700 text-xs transition-colors">
                          {msg.data.options[2]}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {msg.type === 'options' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.data.options.map((opt: string) => (
                      <button 
                        key={opt} 
                        onClick={() => handleOptionSelect(opt)} 
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === 'report' && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-xl p-5 text-sm shadow-sm w-full">
                    <div className="font-medium text-gray-800 mb-3 flex items-center gap-2 text-base">
                      <FileText size={18} className="text-blue-600"/> 配置概览
                    </div>
                    <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">{msg.data.summary}</p>
                    
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4">
                      <div className="text-orange-800 font-medium mb-2 flex items-center gap-1.5">
                        <AlertTriangle size={16} /> 风险预警
                      </div>
                      <ul className="list-disc list-inside text-orange-700 text-xs space-y-1.5 leading-relaxed">
                        {msg.data.risks.map((risk: string, idx: number) => <li key={idx}>{risk}</li>)}
                      </ul>
                    </div>

                    <div className="text-gray-600 text-xs mb-5 flex items-start gap-1.5 bg-blue-50/50 p-3 rounded-lg text-blue-800 leading-relaxed">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      {msg.data.action}
                    </div>

                    {/* 魔法修改按钮 (Magic Edit Buttons) */}
                    {chatStage === 6 && (
                      <div className="mb-5 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1.5 font-medium">
                          <Wand2 size={14} className="text-purple-500" /> 魔法修改 (快速微调)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleOptionSelect('力度加大')} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs hover:bg-purple-100 transition-colors flex items-center gap-1">
                            <Sparkles size={12} /> 力度加大
                          </button>
                          <button onClick={() => handleOptionSelect('人群收窄')} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs hover:bg-purple-100 transition-colors flex items-center gap-1">
                            <Sparkles size={12} /> 人群收窄
                          </button>
                        </div>
                      </div>
                    )}

                    {chatStage === 6 && msg.data.options && (
                      <div className="flex gap-3">
                        {msg.data.options.map((opt: string) => (
                          <button 
                            key={opt} 
                            onClick={() => handleOptionSelect(opt)} 
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${opt.includes('确认') ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {opt.includes('确认') && <CheckCircle size={16} />}
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框与联想搜索 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 relative">
          
          {/* 联想搜索框 (Suggestive Search Box) */}
          {suggestions.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 animate-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-500" /> AI 猜你想问
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 transition-colors"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-3">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-200" title="上传附件">
              <Paperclip size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-200" title="语音输入">
              <Mic size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              className="flex-1 border border-gray-300 rounded-xl p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="输入您的意图或指令..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
