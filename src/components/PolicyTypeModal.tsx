import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
  onConfirm: (typeId: string, typeName: string) => void;
}

const policyCategories = [
  {
    title: '单品销售激励',
    subtitle: '按销售数量计算',
    options: [
      { id: 'single_product', label: '按商品激励' },
      { id: 'single_batch', label: '按商品批号激励' }
    ]
  },
  {
    title: '疗程销售激励',
    subtitle: '按销售数量计算',
    options: [
      { id: 'course_qty', label: '按数量有限' },
      { id: 'course_amount', label: '按奖励金额有限' }
    ]
  },
  {
    title: '关联销售激励',
    options: [
      { id: 'assoc_combo', label: '组合关联（多品多件固定商品组合）', desc: '组合形式自由搭配，支持以下任意搭配方式。例如：A+B; A+B+C; 2A+B+2C等' },
      { id: 'assoc_high_low', label: '高频带低频（关联任一商品组合）', desc: '固定某一单件品种可关联设置范围内的任一单件品种。例如：A+ (B/C/D/F...)' },
      { id: 'assoc_high_series', label: '高频带系列', desc: '任意多个主商品搭配关联品A+关联品B+关联品C（最多十组关联品）中的其他商品一起售卖才可获得激励，不满足条件将...' },
      { id: 'assoc_series', label: '系列关联（任意商品组合）', desc: '关联设置范围内的任意品种组合。例如：汤臣倍健系列任意多个商品组合得激励（A+B+C...）' }
    ]
  },
  {
    title: '销售排名激励',
    options: [
      { id: 'rank_single', label: '单品动销排名激励', desc: '设置商品动销排名激励，提高参与活动员工积极性与执行力' },
      { id: 'rank_week', label: '销售额周排名激励', desc: '基于每个连锁对店员设置周销售额排行奖励，促进连锁员工参与积极性，提高动销' },
      { id: 'rank_month', label: '销售额月排名激励', desc: '基于每个连锁对店员设置月销售额排行奖励，促进连锁员工参与积极性，提高动销' }
    ]
  }
];

export default function PolicyTypeModal({ onClose, onConfirm }: Props) {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleConfirm = () => {
    if (!selectedId) return;
    let selectedName = '';
    policyCategories.forEach(cat => {
      const opt = cat.options.find(o => o.id === selectedId);
      if (opt) selectedName = opt.label;
    });
    onConfirm(selectedId, selectedName);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-medium text-gray-900">这里是标题</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto space-y-10">
            {policyCategories.map((category, catIdx) => (
              <div key={catIdx} className="flex gap-8">
                {/* Left Column: Title & Subtitle */}
                <div className="w-32 shrink-0 pt-2">
                  <h3 className="text-base font-medium text-gray-800">{category.title}</h3>
                  {category.subtitle && (
                    <p className="text-xs text-gray-400 mt-1">{category.subtitle}</p>
                  )}
                </div>

                {/* Right Column: Options */}
                <div className="flex-1 space-y-3">
                  {category.options.map((option) => {
                    const isSelected = selectedId === option.id;
                    return (
                      <div 
                        key={option.id}
                        onClick={() => setSelectedId(option.id)}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        {/* Custom Checkbox */}
                        <div className={`w-4 h-4 mt-0.5 mr-3 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        
                        {/* Option Content */}
                        <div className="flex-1">
                          <div className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            {option.label}
                          </div>
                          {option.desc && (
                            <div className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                              {option.desc}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-white rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md text-sm hover:bg-blue-50 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`px-6 py-2 rounded-md text-sm transition-colors ${
              selectedId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-400 text-white/80 cursor-not-allowed'
            }`}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
