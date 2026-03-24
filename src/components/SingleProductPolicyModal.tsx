import React, { useState } from 'react';
import { X, Plus, Info } from 'lucide-react';
import { SingleProductPolicyDetails } from '../types';

interface Props {
  onClose: () => void;
  onConfirm: (details: SingleProductPolicyDetails) => void;
}

export default function SingleProductPolicyModal({ onClose, onConfirm }: Props) {
  const [isTiered, setIsTiered] = useState(false);
  const [clerkReward, setClerkReward] = useState('');
  const [managerReward, setManagerReward] = useState('');
  const [regionalManagerReward, setRegionalManagerReward] = useState('');
  const [chainReward, setChainReward] = useState('');
  
  const [thresholdType, setThresholdType] = useState<'amount' | 'percentage'>('amount');
  const [thresholdMin, setThresholdMin] = useState('');
  const [thresholdMax, setThresholdMax] = useState('');

  const handleConfirm = () => {
    onConfirm({
      isTiered,
      clerkReward,
      managerReward,
      regionalManagerReward,
      chainReward,
      thresholdType,
      thresholdMin,
      thresholdMax
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-medium text-gray-900">新增单品销售激励政策</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* 选择激励商品 */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 flex items-center justify-center">
              <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                <Plus size={18} /> 选择激励商品
              </button>
            </div>

            {/* 设置单品激励规则 */}
            <div>
              <div className="flex items-baseline gap-3 mb-6">
                <h3 className="text-base font-bold text-gray-900">设置单品激励规则</h3>
                <span className="text-sm text-gray-400">按销售数量计算</span>
              </div>

              {/* 激励方式 */}
              <div className="flex items-center gap-8 mb-6">
                <span className="text-sm text-gray-700 w-16">激励方式</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="isTiered" 
                      checked={!isTiered} 
                      onChange={() => setIsTiered(false)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">无阶梯</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="isTiered" 
                      checked={isTiered} 
                      onChange={() => setIsTiered(true)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">有阶梯</span>
                  </label>
                </div>
              </div>

              {/* 激励规则提示 */}
              <div className="flex items-start gap-8 mb-6">
                <span className="text-sm text-gray-700 w-16 pt-3">激励规则</span>
                <div className="flex-1 bg-orange-50/50 border border-orange-100 rounded-lg p-3 flex items-center gap-2 text-sm text-gray-600">
                  <Info size={16} className="text-orange-400 shrink-0" />
                  单张小票销售数量2件，店员每件奖励5元，奖励共10元。
                </div>
              </div>

              {/* 奖励表格 */}
              <div className="ml-24 mb-2">
                <table className="w-full border border-gray-200 text-sm text-center rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="py-3 px-4 font-medium border-r border-gray-200">销售件数</th>
                      <th className="py-3 px-4 font-medium border-r border-gray-200">
                        <span className="text-red-500 mr-1">*</span>店员每件奖励
                      </th>
                      <th className="py-3 px-4 font-medium border-r border-gray-200">店长每件奖励</th>
                      <th className="py-3 px-4 font-medium border-r border-gray-200">区域经理每件奖励</th>
                      <th className="py-3 px-4 font-medium">连锁抽佣每件奖励</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 border-r border-gray-200 text-gray-700">每销售1件</td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center"
                            placeholder="请输入"
                            value={clerkReward}
                            onChange={e => setClerkReward(e.target.value)}
                          />
                          <span className="text-gray-500">元</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center"
                            placeholder="请输入"
                            value={managerReward}
                            onChange={e => setManagerReward(e.target.value)}
                          />
                          <span className="text-gray-500">元</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center"
                            placeholder="请输入"
                            value={regionalManagerReward}
                            onChange={e => setRegionalManagerReward(e.target.value)}
                          />
                          <span className="text-gray-500">元</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center"
                            placeholder="请输入"
                            value={chainReward}
                            onChange={e => setChainReward(e.target.value)}
                          />
                          <span className="text-gray-500">元</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-xs text-orange-500 mt-2">注：店员角色激励必填，其他角色可不填写</div>
              </div>

              {/* 激励门槛 */}
              <div className="flex items-start gap-8 mt-8">
                <span className="text-sm text-gray-700 w-16 pt-1">激励门槛</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    商品实际销售单价低于xx元或小于标价xx%则不发放激励，无门槛则不设置，配置最大值，商品实际销售单价高于xx元或高于标价xx%则不发放激励。
                  </p>
                  
                  <div className="space-y-4">
                    {/* 金额门槛 */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="thresholdType"
                        checked={thresholdType === 'amount'}
                        onChange={() => setThresholdType('amount')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <input 
                          type="number" 
                          className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center disabled:bg-gray-50 disabled:text-gray-400"
                          disabled={thresholdType !== 'amount'}
                          value={thresholdType === 'amount' ? thresholdMin : ''}
                          onChange={e => setThresholdMin(e.target.value)}
                        />
                        <span>元 ≤ 实付销售金额 ≤</span>
                        <input 
                          type="number" 
                          className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center disabled:bg-gray-50 disabled:text-gray-400"
                          disabled={thresholdType !== 'amount'}
                          value={thresholdType === 'amount' ? thresholdMax : ''}
                          onChange={e => setThresholdMax(e.target.value)}
                        />
                        <span>元，发放激励。</span>
                      </div>
                    </label>

                    {/* 比例门槛 */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="thresholdType"
                        checked={thresholdType === 'percentage'}
                        onChange={() => setThresholdType('percentage')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>标价</span>
                        <input 
                          type="number" 
                          className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center disabled:bg-gray-50 disabled:text-gray-400"
                          disabled={thresholdType !== 'percentage'}
                          value={thresholdType === 'percentage' ? thresholdMin : ''}
                          onChange={e => setThresholdMin(e.target.value)}
                        />
                        <span>% ≤ 实付销售金额 ≤ 标价</span>
                        <input 
                          type="number" 
                          className="w-20 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 text-center disabled:bg-gray-50 disabled:text-gray-400"
                          disabled={thresholdType !== 'percentage'}
                          value={thresholdType === 'percentage' ? thresholdMax : ''}
                          onChange={e => setThresholdMax(e.target.value)}
                        />
                        <span>%，发放激励。</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
