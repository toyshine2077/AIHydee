export type IncentiveMode = 'immediate' | 'delayed';
export type IncentiveType = 'quantity' | 'amount';
export type FeePayer = 'chain' | 'factory';

export interface ActivityConfig {
  basicInfo: {
    serviceFeePayer: FeePayer;
    industry: string;
    theme: string;
    incentiveMode: IncentiveMode;
    incentiveCalculation: IncentiveType;
    incentiveDistribution: string; // 按固定金额
    targetId: string;
    startTime: string;
    endTime: string;
    cover: string;
    summary: string;
  };
  incentivePolicy: {
    // 简化版，实际业务会更复杂
    policies: any[];
  };
  products: any[];
  stores: any[];
}
