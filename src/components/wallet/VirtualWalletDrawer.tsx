import React, { useState } from 'react';
import {
  Wallet,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import { useVirtualWallet } from '../../context/VirtualWalletContext';
import { formatPrice } from '../../utils/formatters';

interface VirtualWalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCars?: () => void;
}

const QUICK_AMOUNTS = [
  { label: '+ ۵۰۰ میلیون', amount: 500000000 },
  { label: '+ ۱ میلیارد', amount: 1000000000 },
  { label: '+ ۵ میلیارد', amount: 5000000000 },
  { label: '+ ۱۰ میلیارد', amount: 10000000000 },
];

export const VirtualWalletDrawer: React.FC<VirtualWalletDrawerProps> = ({
  isOpen,
  onClose,
  onExploreCars,
}) => {
  const { balanceToman, transactions, deposit, resetBalance } = useVirtualWallet();
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickDeposit = (amount: number, label: string) => {
    deposit(amount, `واریز سریع بودجه خرید خودرو (${label})`);
    setDepositSuccessMsg(`مبلغ ${label} با موفقیت به بودجه خرید اضافه شد.`);
    setTimeout(() => setDepositSuccessMsg(''), 3000);
  };

  const handleCustomDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = Number(customAmountInput.replace(/[^0-9]/g, ''));
    if (cleanNum > 0) {
      deposit(cleanNum, 'واریز اختصاصی به بودجه خرید');
      setCustomAmountInput('');
      setDepositSuccessMsg(`مبلغ ${cleanNum.toLocaleString('fa-IR')} تومان با موفقیت واریز شد.`);
      setTimeout(() => setDepositSuccessMsg(''), 3000);
    }
  };

  // USD estimation using standard parity rate (98,500)
  const usdEquivalent = Math.round(balanceToman / 98500);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-persian">
      {/* Backdrop with high blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Container (Side Panel / Modal) */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#09090C]/95 backdrop-blur-2xl border-r border-[#D4AF37]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between text-[#F2F0EA]">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  VIP EXECUTIVE WALLET
                </div>
                <h2 className="text-lg font-bold text-white">کیف پول مجازی نوآر موتورز</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Balance Card in Glassmorphism style */}
            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-[#D4AF37]/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>موجودی اختصاصی بودجه خرید</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                  اعتبار فعال
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-white font-latin tabular-nums tracking-tight">
                  {balanceToman.toLocaleString('fa-IR')}{' '}
                  <span className="text-sm font-normal text-white/60 font-persian">تومان</span>
                </div>
                <div className="text-xs text-[#D4AF37] font-mono font-medium">
                  ≈ ${usdEquivalent.toLocaleString('en-US')} USD{' '}
                  <span className="text-white/40 text-[10px]">(نرخ حواله دبی)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-white/50">
                <span>تضمین نقدینگی خرید سوپراسپرت</span>
                <button
                  onClick={resetBalance}
                  className="text-white/40 hover:text-[#D4AF37] flex items-center gap-1 text-[10px] transition-colors"
                  title="بازنشانی بودجه"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>بازنشانی به ۱۲ میلیارد</span>
                </button>
              </div>
            </div>

            {/* Notification message */}
            {depositSuccessMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{depositSuccessMsg}</span>
              </div>
            )}

            {/* Quick Deposit Actions */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-white/90">
                شارژ سریع بودجه فرضی (جهت بررسی قدرت خرید):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_AMOUNTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickDeposit(item.amount, item.label)}
                    className="p-3 bg-white/[0.03] hover:bg-[#D4AF37]/15 border border-white/[0.08] hover:border-[#D4AF37]/50 text-xs font-medium text-white transition-all flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <Plus className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D4AF37]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Deposit Form */}
            <form onSubmit={handleCustomDeposit} className="space-y-2">
              <label className="block text-xs text-white/70">یا وارد کردن مبلغ دلخواه (تومان):</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="10000000"
                  step="10000000"
                  value={customAmountInput}
                  onChange={(e) => setCustomAmountInput(e.target.value)}
                  placeholder="مثال: ۲۵۰۰۰۰۰۰۰۰ (۲.۵ میلیارد)"
                  className="flex-1 bg-black/60 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={!customAmountInput}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F2F0EA] text-[#050505] text-xs font-bold transition-colors disabled:opacity-40"
                >
                  افزایش
                </button>
              </div>
            </form>

            {/* Transaction History */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                <span>گردش حساب و تراکنش‌های بودجه</span>
                <span className="text-[10px] text-white/40 font-mono">
                  {transactions.length} تراکنش
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 ${
                          tx.type === 'DEPOSIT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.type === 'RESERVE'
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {tx.type === 'DEPOSIT' ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white truncate max-w-[180px]">
                          {tx.title}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono mt-0.5">
                          {tx.timestamp}
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-latin tabular-nums font-bold">
                      <span
                        className={
                          tx.type === 'DEPOSIT'
                            ? 'text-emerald-400'
                            : tx.type === 'RESERVE'
                            ? 'text-[#D4AF37]'
                            : 'text-white/80'
                        }
                      >
                        {tx.type === 'DEPOSIT' ? '+' : '-'}
                        {tx.amountToman.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[10px] text-white/40 block font-persian font-normal">
                        تومان
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-6 border-t border-white/[0.08] bg-black/60 space-y-3">
            <button
              onClick={() => {
                onClose();
                if (onExploreCars) onExploreCars();
              }}
              className="w-full py-3 text-xs font-bold text-[#050505] bg-[#D4AF37] hover:bg-[#F2F0EA] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <span>مشاهده خودروهای منطبق با بودجه من</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-white/40 text-center leading-relaxed">
              کیف پول فرضی نوآر موتورز به شما کمک می‌کند ارزش برابری و میزان آمادگی مالی خود را برای
              سفارش‌گذاری نقدی یا بیعانه ارزی ارزیابی فرمایید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
