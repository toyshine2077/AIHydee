import { ActivityConfig } from '../types';

interface Props {
  config: ActivityConfig;
  onChange: (config: ActivityConfig) => void;
}

export default function BasicInfoForm({ config, onChange }: Props) {
  const updateBasicInfo = (key: keyof ActivityConfig['basicInfo'], value: any) => {
    onChange({
      ...config,
      basicInfo: { ...config.basicInfo, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* 海典服务费 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 海典服务费</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={config.basicInfo.serviceFeePayer === 'chain'} onChange={() => updateBasicInfo('serviceFeePayer', 'chain')} /> 连锁汇付款号
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={config.basicInfo.serviceFeePayer === 'factory'} onChange={() => updateBasicInfo('serviceFeePayer', 'factory')} /> 厂家汇付款号
          </label>
        </div>
      </div>

      {/* 关联工业 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 关联工业</label>
        <select className="w-full border border-gray-300 rounded-lg p-2.5" value={config.basicInfo.industry} onChange={(e) => updateBasicInfo('industry', e.target.value)}>
          <option value="">请选择</option>
          <option value="food">食品</option>
          <option value="cosmetics">化妆品</option>
        </select>
      </div>

      {/* 活动主题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 活动主题</label>
        <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5" maxLength={30} value={config.basicInfo.theme} onChange={(e) => updateBasicInfo('theme', e.target.value)} placeholder="请输入活动主题" />
        <div className="text-right text-xs text-gray-400 mt-1">{config.basicInfo.theme.length}/30</div>
      </div>

      {/* 激励模式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 激励模式</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input type="radio" checked={config.basicInfo.incentiveMode === 'immediate'} onChange={() => updateBasicInfo('incentiveMode', 'immediate')} />
            <div>
              <div className="font-medium">及时豆模式 <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">推荐</span></div>
              <div className="text-xs text-gray-500">即时激励，实时向店员发放销售激励</div>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input type="radio" checked={config.basicInfo.incentiveMode === 'delayed'} onChange={() => updateBasicInfo('incentiveMode', 'delayed')} />
            <div>
              <div className="font-medium">延时豆模式</div>
              <div className="text-xs text-gray-500">由连锁线下向店员结算销售激励</div>
            </div>
          </label>
        </div>
      </div>

      {/* 激励计算 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 激励计算</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={config.basicInfo.incentiveCalculation === 'quantity'} onChange={() => updateBasicInfo('incentiveCalculation', 'quantity')} /> 按商品数量
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={config.basicInfo.incentiveCalculation === 'amount'} onChange={() => updateBasicInfo('incentiveCalculation', 'amount')} /> 按商品金额
          </label>
        </div>
      </div>

      {/* 活动时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 活动时间</label>
        <div className="flex items-center gap-2">
          <input type="date" className="border border-gray-300 rounded-lg p-2.5 flex-1" value={config.basicInfo.startTime} onChange={(e) => updateBasicInfo('startTime', e.target.value)} />
          <span>至</span>
          <input type="date" className="border border-gray-300 rounded-lg p-2.5 flex-1" value={config.basicInfo.endTime} onChange={(e) => updateBasicInfo('endTime', e.target.value)} />
        </div>
      </div>

      {/* 活动简介 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* 活动简介</label>
        <textarea className="w-full border border-gray-300 rounded-lg p-2.5 h-24" maxLength={300} value={config.basicInfo.summary} onChange={(e) => updateBasicInfo('summary', e.target.value)} placeholder="请输入活动简介" />
        <div className="text-right text-xs text-gray-400 mt-1">{config.basicInfo.summary.length}/300</div>
      </div>
    </div>
  );
}
