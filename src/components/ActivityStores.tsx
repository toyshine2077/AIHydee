import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const ActivityStores: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4 mb-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">所属企业</label>
            <div className="relative flex-1">
              <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm appearance-none text-gray-500 bg-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>请选择</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">门店编码</label>
            <input type="text" placeholder="门店编码" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">门店名称</label>
            <input type="text" placeholder="门店名称" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">机构类型</label>
            <div className="relative flex-1">
              <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm appearance-none text-gray-500 bg-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>选择机构类型</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">所属机构</label>
            <div className="relative flex-1">
              <input type="text" placeholder="输入机构/门店名称" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400" />
              <Search size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">所属区域</label>
            <div className="relative flex-1">
              <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm appearance-none text-gray-500 bg-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>请选择</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16 text-right shrink-0">所属片区</label>
            <div className="relative flex-1">
              <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm appearance-none text-gray-500 bg-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>请选择所属片区</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <button className="bg-blue-600 text-white px-5 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors font-medium">查询</button>
            <button className="bg-white text-blue-600 border border-blue-600 px-5 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors font-medium">重置</button>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Actions */}
        <div className="flex items-center gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors font-medium">添加门店</button>
          <button className="bg-white text-blue-600 border border-blue-600 px-4 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors font-medium">导入门店</button>
          <div className="relative">
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors flex items-center gap-1 font-medium">
              更多操作 <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-500 mb-4">
          当前活动共计 <span className="text-red-500 font-medium">0</span> 家门店参与活动，您当前可操作 <span className="text-red-500 font-medium">0</span> 家门店，活动将按其参与时间计算活动商品奖励与统计销售数据。
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-sm overflow-hidden mb-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="p-3 w-12 text-center border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300 cursor-pointer" /></th>
                <th className="p-3 font-medium border-r border-gray-200">门店编码</th>
                <th className="p-3 font-medium border-r border-gray-200">门店名称</th>
                <th className="p-3 font-medium border-r border-gray-200">所属企业</th>
                <th className="p-3 font-medium border-r border-gray-200">机构分类</th>
                <th className="p-3 font-medium border-r border-gray-200">所属机构</th>
                <th className="p-3 font-medium border-r border-gray-200">所属区域</th>
                <th className="p-3 font-medium">参与时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-500 text-sm">
                  暂无数据
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="selectAll" className="rounded border-gray-300 cursor-pointer" />
            <label htmlFor="selectAll" className="cursor-pointer">全选</label>
          </div>
          <div className="flex items-center gap-3">
            <span>共 0 条</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed text-xs">&lt;</button>
              <button className="w-7 h-7 flex items-center justify-center border border-blue-500 rounded text-blue-600 bg-blue-50 text-xs font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed text-xs">&gt;</button>
            </div>
            <div className="relative">
              <select className="border border-gray-300 rounded px-2 py-1 pr-6 appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option>10条/页</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-1">
              <span>跳转至</span>
              <input type="text" defaultValue="1" className="w-10 border border-gray-300 rounded px-1 py-1 text-center focus:outline-none focus:border-blue-500" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStores;
