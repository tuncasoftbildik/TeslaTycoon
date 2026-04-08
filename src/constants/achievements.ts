export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  type: 'totalEarned' | 'businessLevel' | 'businessUnlocked' | 'managersHired' | 'manualCollects' | 'prestigeCount';
  businessId?: string;
  rewardMultiplier?: number;
  rewardCash?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_car', title: 'First Roll-Off', description: 'Build your first Model 3', icon: '🚗', target: 1, type: 'businessLevel', businessId: 'model3', rewardCash: 100 },
  { id: 'model3_10', title: 'Giga Rookie', description: 'Model 3 Factory level 10', icon: '🏭', target: 10, type: 'businessLevel', businessId: 'model3', rewardCash: 1000 },
  { id: 'model3_25', title: 'Production Hell', description: 'Model 3 Factory level 25', icon: '🔥', target: 25, type: 'businessLevel', businessId: 'model3', rewardCash: 10000 },
  { id: 'model3_100', title: 'Model 3 Master', description: 'Model 3 Factory level 100', icon: '💎', target: 100, type: 'businessLevel', businessId: 'model3' },
  { id: 'unlock_3', title: 'Diversify', description: 'Unlock 3 businesses', icon: '📈', target: 3, type: 'businessUnlocked', rewardCash: 2000 },
  { id: 'unlock_5', title: 'Ecosystem', description: 'Unlock 5 businesses', icon: '🌐', target: 5, type: 'businessUnlocked', rewardCash: 25000 },
  { id: 'unlock_all', title: 'Occupy Mars', description: 'Unlock all 10 businesses', icon: '🪐', target: 10, type: 'businessUnlocked' },
  { id: 'hire_1', title: 'First Hire', description: 'Hire your first manager', icon: '👔', target: 1, type: 'managersHired', rewardCash: 5000 },
  { id: 'hire_5', title: 'Delegator', description: 'Hire 5 managers', icon: '🧑‍💼', target: 5, type: 'managersHired' },
  { id: 'hire_all', title: 'Hands Free', description: 'Hire all 10 managers', icon: '🧘', target: 10, type: 'managersHired' },
  { id: 'earn_10k', title: 'Ten K', description: 'Earn $10,000 total', icon: '💵', target: 10000, type: 'totalEarned' },
  { id: 'earn_100k', title: 'Six Figures', description: 'Earn $100,000 total', icon: '💰', target: 100000, type: 'totalEarned' },
  { id: 'earn_1m', title: 'Millionaire', description: 'Earn $1,000,000 total', icon: '🤑', target: 1000000, type: 'totalEarned' },
  { id: 'earn_10m', title: 'Ten Mil', description: 'Earn $10M total', icon: '💸', target: 10000000, type: 'totalEarned' },
  { id: 'earn_100m', title: 'Hundred Mil', description: 'Earn $100M total', icon: '🏦', target: 100000000, type: 'totalEarned' },
  { id: 'earn_1b', title: 'Billionaire', description: 'Earn $1B total', icon: '👑', target: 1000000000, type: 'totalEarned' },
  { id: 'earn_1t', title: 'Trillionaire', description: 'Earn $1T total', icon: '🌌', target: 1000000000000, type: 'totalEarned' },
  { id: 'click_10', title: 'Warming Up', description: '10 manual collects', icon: '👆', target: 10, type: 'manualCollects', rewardCash: 500 },
  { id: 'click_100', title: 'Fast Fingers', description: '100 manual collects', icon: '✋', target: 100, type: 'manualCollects', rewardCash: 5000 },
  { id: 'click_1000', title: 'Clicker God', description: '1,000 manual collects', icon: '🙌', target: 1000, type: 'manualCollects' },
  { id: 'prestige_1', title: 'Reborn', description: 'First prestige', icon: '⭐', target: 1, type: 'prestigeCount' },
  { id: 'prestige_5', title: 'Cycle Master', description: 'Prestige 5 times', icon: '🌟', target: 5, type: 'prestigeCount' },
  { id: 'prestige_25', title: 'Ascended', description: 'Prestige 25 times', icon: '✨', target: 25, type: 'prestigeCount' },
  { id: 'super_10', title: 'Charged', description: 'Supercharger level 10', icon: '⚡', target: 10, type: 'businessLevel', businessId: 'supercharger', rewardCash: 5000 },
  { id: 'solar_10', title: 'Sunkissed', description: 'Solar Roof level 10', icon: '☀️', target: 10, type: 'businessLevel', businessId: 'solarroof', rewardCash: 20000 },
  { id: 'cyber_25', title: 'Bulletproof', description: 'Cybertruck level 25', icon: '🛻', target: 25, type: 'businessLevel', businessId: 'cybertruck' },
  { id: 'taxi_25', title: 'No Driver', description: 'Robotaxi level 25', icon: '🤖', target: 25, type: 'businessLevel', businessId: 'robotaxi' },
  { id: 'optimus_10', title: 'Rise of Machines', description: 'Optimus level 10', icon: '🦾', target: 10, type: 'businessLevel', businessId: 'optimus' },
  { id: 'mars_1', title: 'Interplanetary', description: 'Build Mars Colony', icon: '🚀', target: 1, type: 'businessLevel', businessId: 'mars' },
  { id: 'mars_50', title: 'Martian Tycoon', description: 'Mars Colony level 50', icon: '🪐', target: 50, type: 'businessLevel', businessId: 'mars' },
];
