export type IncentiveMode = 'immediate' | 'delayed';
export type IncentiveType = 'quantity' | 'amount';
export type FeePayer = 'chain' | 'factory';

export interface SingleProductPolicyDetails {
  isTiered: boolean;
  clerkReward: string;
  managerReward: string;
  regionalManagerReward: string;
  chainReward: string;
  thresholdType: 'amount' | 'percentage';
  thresholdMin: string;
  thresholdMax: string;
}

export interface IncentivePolicy {
  id: number;
  typeId: string;
  typeName: string;
  name?: string;
  condition?: string;
  reward?: string;
  details?: SingleProductPolicyDetails;
}

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
    policies: IncentivePolicy[];
  };
  products: any[];
  stores: any[];
}
