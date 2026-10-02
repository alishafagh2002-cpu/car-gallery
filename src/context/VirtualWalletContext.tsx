import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle } from '../types';

export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'RESERVE' | 'RESET';
  amountToman: number;
  title: string;
  timestamp: string;
  vehicleHeadline?: string;
}

export interface AffordabilityInfo {
  canAfford: boolean;
  coveragePercent: number;
  deficitToman: number;
  surplusToman: number;
}

interface VirtualWalletContextType {
  balanceToman: number;
  transactions: WalletTransaction[];
  deposit: (amountToman: number, note?: string) => void;
  resetBalance: () => void;
  reserveForVehicle: (vehicle: Vehicle, depositAmountToman: number) => boolean;
  getAffordabilityInfo: (priceToman: number) => AffordabilityInfo;
  isWalletDrawerOpen: boolean;
  setIsWalletDrawerOpen: (open: boolean) => void;
}

const STORAGE_KEYS = {
  BALANCE: 'noir_virtual_wallet_balance_v2',
  TRANSACTIONS: 'noir_virtual_wallet_tx_v2',
};

const DEFAULT_INITIAL_BALANCE = 12000000000; // 12 Billion Tomans (~ $120,000)

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-init-1',
    type: 'DEPOSIT',
    amountToman: 12000000000,
    title: 'تخصیص اولیه بودجه فرضی خرید خودرو',
    timestamp: 'امروز',
  },
];

const VirtualWalletContext = createContext<VirtualWalletContextType | undefined>(undefined);

export const VirtualWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balanceToman, setBalanceToman] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BALANCE);
      if (stored !== null) {
        const val = Number(stored);
        if (!isNaN(val) && val >= 0) return val;
      }
    } catch {
      // fallback
    }
    return DEFAULT_INITIAL_BALANCE;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  const [isWalletDrawerOpen, setIsWalletDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, balanceToman.toString());
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save wallet to storage', e);
    }
  }, [balanceToman, transactions]);

  const deposit = (amountToman: number, note?: string) => {
    if (amountToman <= 0) return;
    const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'DEPOSIT',
      amountToman,
      title: note || 'افزایش بودجه اختصاصی خرید (واریز فرضی)',
      timestamp: now,
    };
    setBalanceToman((prev) => prev + amountToman);
    setTransactions((prev) => [newTx, ...prev]);
  };

  const resetBalance = () => {
    const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'RESET',
      amountToman: DEFAULT_INITIAL_BALANCE,
      title: 'بازنشانی موجودی به بودجه استاندارد ۱۲ میلیارد تومان',
      timestamp: now,
    };
    setBalanceToman(DEFAULT_INITIAL_BALANCE);
    setTransactions([newTx]);
  };

  const reserveForVehicle = (vehicle: Vehicle, depositAmountToman: number): boolean => {
    if (balanceToman < depositAmountToman) return false;
    const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'RESERVE',
      amountToman: depositAmountToman,
      title: `تخصیص بیعانه خرید ${vehicle.brandNameFa} ${vehicle.modelNameFa}`,
      timestamp: now,
      vehicleHeadline: vehicle.headlineFa,
    };
    setBalanceToman((prev) => prev - depositAmountToman);
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const getAffordabilityInfo = (priceToman: number): AffordabilityInfo => {
    if (priceToman <= 0) {
      return { canAfford: true, coveragePercent: 100, deficitToman: 0, surplusToman: balanceToman };
    }
    const canAfford = balanceToman >= priceToman;
    const coveragePercent = Math.min(100, Math.round((balanceToman / priceToman) * 100));
    const deficitToman = Math.max(0, priceToman - balanceToman);
    const surplusToman = Math.max(0, balanceToman - priceToman);

    return {
      canAfford,
      coveragePercent,
      deficitToman,
      surplusToman,
    };
  };

  return (
    <VirtualWalletContext.Provider
      value={{
        balanceToman,
        transactions,
        deposit,
        resetBalance,
        reserveForVehicle,
        getAffordabilityInfo,
        isWalletDrawerOpen,
        setIsWalletDrawerOpen,
      }}
    >
      {children}
    </VirtualWalletContext.Provider>
  );
};

export const useVirtualWallet = (): VirtualWalletContextType => {
  const context = useContext(VirtualWalletContext);
  if (!context) {
    throw new Error('useVirtualWallet must be used within a VirtualWalletProvider');
  }
  return context;
};
