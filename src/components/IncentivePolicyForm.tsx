import React, { useState } from 'react';
import { ActivityConfig, SingleProductPolicyDetails } from '../types';
import PolicyTypeModal from './PolicyTypeModal';
import SingleProductPolicyModal from './SingleProductPolicyModal';

interface Props {
  config: ActivityConfig;
  onChange: React.Dispatch<React.SetStateAction<ActivityConfig>>;
}

export default function IncentivePolicyForm({ config, onChange }: Props) {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isSingleProductModalOpen, setIsSingleProductModalOpen] = useState(false);
  const [pendingType, setPendingType] = useState<{id: string, name: string} | null>(null);

  const handleTypeConfirm = (typeId: string, typeName: string) => {
    setIsTypeModalOpen(false);
    if (typeId === 'single_product') {
      setPendingType({ id: typeId, name: typeName });
      setIsSingleProductModalOpen(true);
    } else {
      // 其他类型暂用通用表单
      handleAddGenericPolicy(typeId, typeName);
    }
  };

  const handleAddGenericPolicy = (typeId: string, typeName: string) => {
    onChange(prev => ({
      ...prev,
      incentivePolicy: {
        ...prev.incentivePolicy,
        policies: [
          ...prev.incentivePolicy.policies,
          { id: Date.now(), typeId, typeName, name: '', condition: '', reward: '' }
        ]
      }
    }));
  };

  const handleSingleProductConfirm = (details: SingleProductPolicyDetails) => {
    if (!pendingType) return;
    onChange(prev => ({
      ...prev,
      incentivePolicy: {
        ...prev.incentivePolicy,
        policies: [
          ...prev.incentivePolicy.policies,
          { 
            id: Date.now(), 
            typeId: pendingType.id, 
            typeName: pendingType.name, 
            details 
          }
        ]
      }
    }));
    setIsSingleProductModalOpen(false);
    setPendingType(null);
  };

  const handleRemovePolicy = (id: number) => {
    onChange(prev => ({
      ...prev,
      incentivePolicy: {
        ...prev.incentivePolicy,
        policies: prev.incentivePolicy.policies.filter(p => p.id !== id)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* 顶部按钮区 */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsTypeModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          新增激励政策
        </button>
      </div>

      {/* 政策列表展示区 */}
      {config.incentivePolicy.policies.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          暂无激励政策，请点击右上角新增
        </div>
      ) : (
        <div className="space-y-4">
          {config.incentivePolicy.policies.map((policy, index) => (
            <div key={policy.id || index} className="p-6 border border-gray-200 rounded-xl bg-gray-50 relative">
              <button 
                onClick={() => handleRemovePolicy(policy.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm"
              >
                删除
              </button>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-medium text-gray-800">激励政策 {index + 1}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                  {policy.typeName || '未选择类型'}
                </span>
              </div>
              
              {policy.typeId === 'single_product' && policy.details ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">激励方式：</span>{policy.details.isTiered ? '有阶梯' : '无阶梯'}</div>
                    <div><span className="text-gray-500">店员每件奖励：</span><span className="text-red-500 font-medium">{policy.details.clerkReward}元</span></div>
                    <div><span className="text-gray-500">店长每件奖励：</span>{policy.details.managerReward || '-'}元</div>
                    <div><span className="text-gray-500">区域经理每件奖励：</span>{policy.details.regionalManagerReward || '-'}元</div>
                    <div className="col-span-2">
                      <span className="text-gray-500">门槛设置：</span>
                      {policy.details.thresholdType === 'amount' 
                        ? `${policy.details.thresholdMin}元 ≤ 实付金额 ≤ ${policy.details.thresholdMax}元`
                        : `标价${policy.details.thresholdMin}% ≤ 实付金额 ≤ 标价${policy.details.thresholdMax}%`}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">政策名称</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      placeholder="如：满100减20" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">奖励金额 (元)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      placeholder="输入金额" 
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 选择政策类型弹窗 */}
      {isTypeModalOpen && (
        <PolicyTypeModal 
          onClose={() => setIsTypeModalOpen(false)} 
          onConfirm={handleTypeConfirm} 
        />
      )}

      {/* 单品销售激励配置弹窗 */}
      {isSingleProductModalOpen && (
        <SingleProductPolicyModal
          onClose={() => {
            setIsSingleProductModalOpen(false);
            setPendingType(null);
          }}
          onConfirm={handleSingleProductConfirm}
        />
      )}
    </div>
  );
}
