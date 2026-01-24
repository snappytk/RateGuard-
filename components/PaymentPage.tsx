
import React, { useEffect } from 'react';
import { ShieldCheck, Zap, CheckCircle, ArrowRight, CreditCard, Sparkles, Clock } from 'lucide-react';
import { PRICING_PLAN } from '../constants';

const PaymentPage: React.FC = () => {
  useEffect(() => {
    // Check if PayPal SDK is loaded and render the button
    const renderPaypalButton = () => {
      const paypal = (window as any).paypal;
      const containerId = 'paypal-button-container-P-4N979922222500015NF2NIXY';
      const container = document.getElementById(containerId);

      if (paypal && container && container.innerHTML === '') {
        paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'silver',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: 'P-4N979922222500015NF2NIXY'
            });
          },
          onApprove: function(data: any, actions: any) {
            alert('Subscription successful! ID: ' + data.subscriptionID);
          }
        }).render('#' + containerId);
      }
    };

    renderPaypalButton();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldCheck size={14} />
          Enterprise-Grade Infrastructure
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
          Activate Your <br /> <span className="text-blue-500">Defense Terminal</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Secure the Global Enterprise license and protect your logistics margins with Atlas AI. 
          Your first <span className="text-white font-bold">10 days are completely free</span>.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Benefits Panel */}
        <div className="space-y-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Standard Benefits</h3>
            <p className="text-zinc-500 text-sm">Everything you need to audit high-volume freight lanes.</p>
          </div>

          <div className="grid gap-6">
            {[
              { icon: <Zap className="text-blue-500" />, title: "Unlimited Atlas AI Audits", desc: "Process thousands of PDFs/JPGs without tiered pricing caps." },
              { icon: <Sparkles className="text-purple-500" />, title: "Profit Guard™ Memory", desc: "AI-driven comparison against your own historical lane rates." },
              { icon: <Clock className="text-emerald-500" />, title: "10-Day Free Trial", desc: "Full access to all features. Your card won't be charged until day 11." },
              { icon: <CheckCircle className="text-indigo-500" />, title: "Auto-Dispute Engine", desc: "One-click professional emails to carriers for surcharge drift." }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-widest">{benefit.title}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed mt-1 font-medium">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-800/50">
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500">
               <ShieldCheck size={18} className="text-emerald-500" />
               SECURE 256-BIT ENCRYPTION
            </div>
          </div>
        </div>

        {/* Payment Action Panel */}
        <div className="bg-white rounded-[2.5rem] p-10 text-zinc-950 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <CreditCard size={120} className="text-black" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Enterprise Standard</div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter">${PRICING_PLAN.price}</span>
              <span className="text-zinc-500 text-xl font-black">/mo</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-100 rounded-3xl border border-zinc-200 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg text-white"><Clock size={16} /></div>
              <span className="text-sm font-black uppercase tracking-widest text-zinc-700">10-Day Trial Active</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              Start your subscription today. You will not be billed until the trial period ends. 
              Cancel anytime from your dashboard.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Secure Checkout via PayPal
            </div>
            {/* PayPal Button Container */}
            <div id="paypal-button-container-P-4N979922222500015NF2NIXY" className="min-h-[150px]"></div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest pt-4 border-t border-zinc-100">
            <ShieldCheck size={12} />
            Money-back guarantee within first month
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
