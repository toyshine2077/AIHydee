import React, { useState, useRef, useEffect } from 'react';
import { ActivityConfig } from './types';
import { Bot, ChevronRight, Save, Send, User, Paperclip, Mic, FileText, AlertTriangle, CheckCircle, Info, Sparkles, Edit3, BarChart2, Wand2, Calculator, Plus, Trash2, PieChart, Wallet, ShieldAlert, Smartphone, Tag, Clock } from 'lucide-react';
import BasicInfoForm from './components/BasicInfoForm';
import IncentivePolicyForm from './components/IncentivePolicyForm';
import ActivityStores from './components/ActivityStores';

type MessageType = 'text' | 'parsing_card' | 'options' | 'report' | 'comparison_lab' | 'tier_calculator' | 'financial_simulation' | 'logic_check' | 'mobile_preview' | 'success_card';

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
    '我想给正大天晴的感冒药做一个为期一个月的及时豆激励',
    '夏季保肝行动',
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

  const steps = ['创建活动信息', '配置激励政策', '活动门店'];

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
          text: '已根据您的描述预填了活动底座信息，请点击确认或修改：',
          type: 'parsing_card',
          data: { 
            sections: [
              {
                title: '基本信息',
                details: [
                  { label: '活动主题', value: '夏季保肝行动' },
                  { label: '活动周期', value: '2026-07-01 ~ 2026-07-31（共 31 天）' },
                  { label: '激励设置', value: '及时豆模式 / 按商品数量计算' },
                  { label: '服务费账号', value: '正大天晴厂家汇付账号（余额：充足）' }
                ]
              },
              {
                title: '生效范围',
                details: [
                  { label: '目标区域', value: '华东区' },
                  { label: '预计参与', value: '245 家门店（已排除机构分类为‘停用’的门店）' }
                ]
              },
              {
                title: '其他',
                details: [
                  { label: '氛围预设', value: '已为您生成 3 张‘清新保肝’风格的活动封面，点击可切换。' }
                ]
              }
            ],
            options: ['确认并继续', '修改信息']
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

    if (chatStage === 2 && option === '确认并继续') {
      // 阶段三：策略深度追问 - 阶梯逻辑
      setConfig(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          industry: '正大天晴药业集团',
          theme: '夏季保肝行动',
          startTime: '2026-07-01',
          endTime: '2026-07-31',
          incentiveMode: 'immediate',
          incentiveCalculation: 'quantity'
        }
      }));

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '关于阶梯逻辑：您是想每卖一件就奖固定金额，还是鼓励多卖？比如‘单笔满2件，每件奖励翻倍’？',
          type: 'options',
          data: { options: ['固定金额 (无阶梯)', '鼓励多卖 (有阶梯)'] }
        }]);
        setChatStage(3);
      }, 800);
    } else if (chatStage === 3) {
      if (option === '鼓励多卖 (有阶梯)') {
        setTimeout(() => {
          setStep(2); // 切换到政策配置页
          setConfig(prev => ({
            ...prev,
            incentivePolicy: {
              policies: [
                {
                  id: Date.now(),
                  typeId: 'single_product',
                  typeName: '按商品激励',
                  details: {
                    isTiered: true,
                    clerkReward: '',
                    managerReward: '',
                    regionalManagerReward: '',
                    chainReward: '',
                    thresholdType: 'none',
                    thresholdMin: '',
                    thresholdMax: ''
                  }
                }
              ]
            }
          }));
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'ai',
            text: '好的，已为您开启阶梯模式，请在下方配置阶梯奖励规则：',
            type: 'tier_calculator',
            data: { 
              tiers: [
                { count: 2, reward: 5 },
                { count: 5, reward: 15 }
              ]
            }
          }]);
          setChatStage(3.5);
        }, 600);
      } else {
        setTimeout(() => {
          setStep(2);
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
                    clerkReward: '5',
                    managerReward: '',
                    regionalManagerReward: '',
                    chainReward: '',
                    thresholdType: 'none',
                    thresholdMin: '',
                    thresholdMax: ''
                  }
                }
              ]
            }
          }));
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'ai',
            text: '好的，已设置为无阶梯。关于统计周期：奖励是按‘单张小票’实时算，还是攒到‘活动结束’按总数算？',
            type: 'options',
            data: { options: ['单张小票', '活动结束'] }
          }]);
          setChatStage(4);
        }, 600);
      }
    } else if (chatStage === 3.5 && option === '保存阶梯') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '阶梯已保存。关于统计周期：奖励是按‘单张小票’实时算，还是攒到‘活动结束’按总数算？',
          type: 'options',
          data: { options: ['单张小票', '活动结束'] }
        }]);
        setChatStage(4);
      }, 600);
    } else if (chatStage === 4) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '关于价格红线：如果门店私自打折太狠，还要给激励吗？比如售价低于标价 85% 时是否自动失效？',
          type: 'options',
          data: { options: ['低于85%不发', '不设置门槛'] }
        }]);
        setChatStage(5);
      }, 600);
    } else if (chatStage === 5) {
      if (option === '低于85%不发') {
        setConfig(prev => {
          const newPolicies = [...prev.incentivePolicy.policies];
          if (newPolicies.length > 0 && newPolicies[0].details) {
            newPolicies[0].details.thresholdType = 'percentage';
            newPolicies[0].details.thresholdMin = '85';
            newPolicies[0].details.thresholdMax = '100';
          }
          return { ...prev, incentivePolicy: { policies: newPolicies } };
        });
      }
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '关于多角色抽佣：除了给一线店员奖励，店长和区域经理是否也要按比例‘见者有份’？或者按固定金额给他们提成？',
          type: 'options',
          data: { options: ['店长抽成1元', '区管抽成0.5元', '仅店员'] }
        }]);
        setChatStage(6);
      }, 600);
    } else if (chatStage === 6) {
      if (option === '店长抽成1元') {
        setConfig(prev => {
          const newPolicies = [...prev.incentivePolicy.policies];
          if (newPolicies.length > 0 && newPolicies[0].details) {
            newPolicies[0].details.managerReward = '1';
          }
          return { ...prev, incentivePolicy: { policies: newPolicies } };
        });
      }
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '按您设置的店员 5 元/件，若按常规比例配置，建议店长激励为 1 元，区域经理 0.5 元。当前单件总激励支出为 6.5 元。',
          type: 'financial_simulation',
          data: {
            total: '6.5',
            roles: [
              { name: '店员', amount: '5.0', percentage: '77' },
              { name: '店长', amount: '1.0', percentage: '15' },
              { name: '区域经理', amount: '0.5', percentage: '8' }
            ],
            warning: '根据该品种往期销量预估，本次活动预计消耗服务费 1.5 万元，您关联的【正大天晴厂家汇付账号】余额充足，请放心配置。'
          }
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: '关于氛围：我已为您生成了 3 张符合“夏季保肝”主题的活动封面，您选一张，还是自己上传？',
            type: 'options',
            data: { options: ['使用封面1', '使用封面2', '使用封面3', '自己上传'] }
          }]);
          setChatStage(7);
        }, 1500);
      }, 600);
    } else if (chatStage === 7) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '注意：您设置了 85% 的价格红线。若该药店执行 8 折促销，该笔销售将无法触发奖励。建议将红线调至 75% 以覆盖促销场景。',
          type: 'logic_check',
          data: {
            suggestion: '模拟结果显示：系统将优先触发‘系列关联’奖励，单品激励将被覆盖。这是您预期的吗？',
            options: ['调整红线至75%', '保持85%不变']
          }
        }]);
        setChatStage(7.5);
      }, 600);
    } else if (chatStage === 7.5) {
      if (option === '调整红线至75%') {
        setConfig(prev => {
          const newPolicies = [...prev.incentivePolicy.policies];
          if (newPolicies.length > 0 && newPolicies[0].details) {
            newPolicies[0].details.thresholdMin = '75';
          }
          return { ...prev, incentivePolicy: { policies: newPolicies } };
        });
      }
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '这是店员在移动端看到的实际效果预览：',
          type: 'mobile_preview',
          data: {
            theme: '夏季保肝行动',
            batchAlert: '专项激励：仅限批号 2024XXXX',
            progressText: '再卖 2 盒即可解锁“第二阶梯”，每盒奖励从 5 元升至 15 元！',
            earlyBird: '每日 11 点开抢'
          }
        }]);
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: 'ai',
              text: '这是您本次活动的完整配置清单与风控报告，请做最后审核：',
              type: 'report',
              data: {
                manifesto: {
                  basic: [
                    { label: '关联工业', value: '正大天晴药业集团' },
                    { label: '活动周期', value: '2026-07-01 ~ 2026-07-31' },
                    { label: '激励模式', value: '及时豆' }
                  ],
                  strategy: [
                    { label: '单品激励', value: '夏季保肝药，阶梯奖励，店员最高 15元/件' },
                    { label: '系列关联', value: '保肝护肝系列，满 3 件为一组，每组奖励 20 元' }
                  ],
                  threshold: [
                    { label: '价格红线', value: '实付金额 ≥ 75% 标价' },
                    { label: '低价不激励线', value: '15 元' }
                  ]
                },
                risks: [
                  { type: '利益冲突', desc: '检测到‘系列关联’与‘单品激励’商品重合。系列激励将自动替代单品激励，预计单笔订单最高支出从 15 元变为 20 元。' },
                  { type: '资金缺口', desc: '按当前配置及往期销量，预计总支出为 2.8 万元。您当前汇付账号可用余额为 3 万元，余额充足，但建议活动过半时关注消耗。' },
                  { type: '覆盖漏洞', desc: '您选择了‘华东区’门店，但有 5 家核心门店因‘ERP 停用’状态未被圈入，是否需要手动添加？' }
                ],
                dashboardPreview: '发布后，您可以在后台实时看到：各门店参与进度、店员领钱排行榜、以及本次活动的 ROI（投入产出比）预估。',
                action: '点击“确认发布”，我将为您同步数据、生成海报及店员端任务通知。',
                options: ['确认发布', '手动添加停用门店', '再改改']
              }
            }
          ]);
          setChatStage(8);
        }, 2000);
      }, 600);
    } else if (chatStage === 8 && option === '确认发布') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: '配置已完成！活动编号：ACT-2026-001。我已经为您将所有配置策略备份至‘历史方案库’，方便下次一键复用。',
          type: 'success_card',
          data: {
            activityId: 'ACT-2026-001',
            actions: ['同步数据至后台数据库', '自动合成活动海报', '生成店员端任务通知', '策略备份至历史方案库']
          }
        }]);
        setChatStage(9);
      }, 1000);
      handleDeploy();
    } else if (chatStage === 8 && (option === '力度加大' || option === '人群收窄')) {
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
      case 3:
        return <ActivityStores />;
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} /> 仅保存
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
                    {msg.data.sections ? (
                      <div className="flex flex-col gap-3 mb-4">
                        {msg.data.sections.map((sec: any, sIdx: number) => (
                          <div key={sIdx} className="bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs font-semibold text-gray-500 mb-2">{sec.title}</div>
                            <div className="flex flex-col gap-2 text-gray-700">
                              {sec.details.map((detail: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-gray-500 shrink-0">{detail.label}：</span>
                                  <span className="font-medium">{detail.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 text-gray-700 mb-4 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                        {msg.data.details?.map((detail: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-gray-500 shrink-0">{detail.label}：</span>
                            <span className="font-medium">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
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

                {/* 阶梯计算器 (Tier Calculator) */}
                {msg.type === 'tier_calculator' && (
                  <div className="mt-2 bg-white border border-purple-200 rounded-xl p-4 text-sm shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <div className="font-medium text-purple-800 mb-4 flex items-center gap-2">
                      <Calculator size={16} className="text-purple-500" /> 阶梯计算器
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-4">
                      {msg.data.tiers.map((tier: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg border border-purple-100">
                          <span className="text-gray-600">满</span>
                          <input type="number" defaultValue={tier.count} className="w-16 p-1 text-center border border-gray-300 rounded bg-white" />
                          <span className="text-gray-600">件，奖</span>
                          <input type="number" defaultValue={tier.reward} className="w-16 p-1 text-center border border-gray-300 rounded bg-white" />
                          <span className="text-gray-600">元</span>
                          <button className="ml-auto text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button className="flex items-center justify-center gap-1 py-2 border border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                        <Plus size={14} /> 添加阶梯
                      </button>
                    </div>

                    <button 
                      onClick={() => handleOptionSelect('保存阶梯')} 
                      className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      保存阶梯配置
                    </button>
                  </div>
                )}

                {/* 利益分配双轴同步 (Financial Simulation) */}
                {msg.type === 'financial_simulation' && (
                  <div className="mt-2 bg-white border border-emerald-200 rounded-xl p-4 text-sm shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div className="font-medium text-emerald-800 mb-3 flex items-center gap-2">
                      <PieChart size={16} className="text-emerald-500" /> 利益分配双轴同步
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-r-emerald-200 border-b-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                        ¥{msg.data.total}
                      </div>
                      <div className="flex-1 space-y-2">
                        {msg.data.roles.map((role: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">{role.name}</span>
                            <span className="font-medium text-gray-800">¥{role.amount} ({role.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs leading-relaxed">
                      <div className="font-medium mb-1 flex items-center gap-1"><Wallet size={14}/> 资金预警</div>
                      {msg.data.warning}
                    </div>
                  </div>
                )}

                {/* 模拟小票校验器 (Logic Check) */}
                {msg.type === 'logic_check' && (
                  <div className="mt-2 bg-white border border-amber-200 rounded-xl p-4 text-sm shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                      <ShieldAlert size={16} className="text-amber-500" /> 模拟小票校验器
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 font-mono text-xs text-gray-600">
                      <div className="border-b border-dashed border-gray-300 pb-2 mb-2">
                        <div className="text-center font-bold text-gray-800 mb-1">模拟交易小票</div>
                        <div className="flex justify-between"><span>商品:</span><span>夏季保肝药 x1</span></div>
                        <div className="flex justify-between"><span>标价:</span><span>¥100.00</span></div>
                        <div className="flex justify-between text-amber-600"><span>实付 (8折促销):</span><span>¥80.00</span></div>
                      </div>
                      <div className="flex justify-between font-bold text-red-500">
                        <span>触发激励:</span><span>失败 (低于85%红线)</span>
                      </div>
                    </div>
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
                      {msg.data.suggestion}
                    </div>
                    {msg.data.options && (
                      <div className="mt-3 flex gap-2">
                        {msg.data.options.map((opt: string) => (
                          <button 
                            key={opt} 
                            onClick={() => handleOptionSelect(opt)} 
                            className="flex-1 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 店员端移动 App 模拟器 (Mobile Preview) */}
                {msg.type === 'mobile_preview' && (
                  <div className="mt-2 bg-gray-100 border border-gray-200 rounded-3xl p-2 shadow-inner w-64 mx-auto relative overflow-hidden">
                    <div className="bg-white rounded-2xl overflow-hidden h-96 flex flex-col shadow-sm border border-gray-100">
                      {/* App Header */}
                      <div className="bg-blue-600 text-white p-3 text-center text-xs font-medium relative">
                        店员端 App
                        <div className="absolute top-3 right-3 flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      </div>
                      {/* Cover */}
                      <div className="h-24 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {msg.data.theme}
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto bg-gray-50">
                        {/* Batch Alert */}
                        {msg.data.batchAlert && (
                          <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] px-2 py-1 rounded flex items-center gap-1 font-medium">
                            <Tag size={10} /> {msg.data.batchAlert}
                          </div>
                        )}
                        {/* Progress */}
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                          <div className="text-xs text-gray-800 font-medium mb-2">当前阶梯进度</div>
                          <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="text-[10px] text-gray-500">{msg.data.progressText}</div>
                        </div>
                        {/* Early Bird */}
                        {msg.data.earlyBird && (
                          <div className="bg-orange-50 p-3 rounded-lg shadow-sm border border-orange-100 flex items-center justify-between">
                            <div className="text-xs text-orange-800 font-medium flex items-center gap-1">
                              <Clock size={12} /> 早鸟抢单
                            </div>
                            <div className="text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                              {msg.data.earlyBird}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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

                {/* 结构化配置清单与风控 (Final Report) */}
                {msg.type === 'report' && (
                  <div className="mt-2 bg-white border border-blue-200 rounded-xl p-4 text-sm shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="font-medium text-blue-800 mb-4 flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" /> 配置确认单 (Structured Manifesto)
                    </div>
                    
                    {/* Manifesto */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">基础信息模块</div>
                        {msg.data.manifesto.basic.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs mb-1"><span className="text-gray-500">{item.label}</span><span className="font-medium text-gray-800">{item.value}</span></div>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">策略模块</div>
                        {msg.data.manifesto.strategy.map((item: any, idx: number) => (
                          <div key={idx} className="flex flex-col text-xs mb-2">
                            <span className="text-gray-500 mb-0.5">{item.label}</span>
                            <span className="font-medium text-gray-800">{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">门槛模块</div>
                        {msg.data.manifesto.threshold.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs mb-1"><span className="text-gray-500">{item.label}</span><span className="font-medium text-gray-800">{item.value}</span></div>
                        ))}
                      </div>
                    </div>

                    {/* Risks */}
                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-4">
                      <div className="font-medium text-red-800 mb-2 flex items-center gap-1 text-xs"><AlertTriangle size={14}/> 关键风控提醒</div>
                      <div className="space-y-2">
                        {msg.data.risks.map((risk: any, idx: number) => (
                          <div key={idx} className="text-xs text-red-700 leading-relaxed">
                            <span className="font-bold">{risk.type}：</span>{risk.desc}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg mb-4 flex items-start gap-2">
                      <BarChart2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-indigo-800 leading-relaxed">
                        <span className="font-bold">激励看板预演：</span>{msg.data.dashboardPreview}
                      </div>
                    </div>

                    <div className="text-gray-600 text-xs mb-3 text-center">{msg.data.action}</div>
                    
                    {/* 魔法修改按钮 (Magic Edit Buttons) */}
                    {chatStage === 8 && (
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

                    {msg.data.options && chatStage === 8 && (
                      <div className="flex flex-col gap-2">
                        {msg.data.options.map((opt: string) => (
                          <button 
                            key={opt} 
                            onClick={() => handleOptionSelect(opt)} 
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                              opt.includes('确认发布') 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center justify-center gap-2 text-sm' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs'
                            }`}
                          >
                            {opt.includes('确认发布') && <Send size={16} />}
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 成功卡片 (Success Card) */}
                {msg.type === 'success_card' && (
                  <div className="mt-2 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 text-sm shadow-sm w-full text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={24} />
                    </div>
                    <div className="font-bold text-emerald-800 text-lg mb-1">发布成功！</div>
                    <div className="text-emerald-600 font-mono text-xs mb-4 bg-emerald-100/50 inline-block px-3 py-1 rounded-full">
                      活动编号：{msg.data.activityId}
                    </div>
                    
                    <div className="text-left bg-white/60 rounded-lg p-3 mb-4 border border-emerald-100/50">
                      <div className="text-xs font-bold text-gray-700 mb-2">系统已自动执行：</div>
                      <div className="space-y-2">
                        {msg.data.actions.map((action: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle size={12} className="text-emerald-500" /> {action}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      我已经为您将所有配置策略备份至“历史方案库”，方便下次一键复用。
                    </div>
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
