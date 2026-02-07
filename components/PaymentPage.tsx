import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Zap, CheckCircle, CreditCard } from 'lucide-react';
import { processEnterpriseUpgrade, auth } from '../services/firebase';

interface PaymentPageProps {
  orgId: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ orgId }) => {
  const [success, setSuccess] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for global paypal object
    const checkForPayPal = setInterval(() => {
      if ((window as any).paypal && paypalRef.current) {
        clearInterval(checkForPayPal);
        renderPayPalButtons();
      }
    }, 100);

    return () => clearInterval(checkForPayPal);
  }, [orgId]);

  const renderPayPalButtons = () => {
    if (!paypalRef.current || paypalRef.current.innerHTML !== "") return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      (window as any).paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: 'P-1UB7789392647964ANF3SL4I'
          });
        },
        onApprove: function(data: any, actions: any) {
          processEnterpriseUpgrade(uid, orgId, data.subscriptionID).then((upgraded) => {
            if (upgraded) {
              setSuccess(true);
              setTimeout(() => window.location.reload(), 2000);
            } else {
              alert("Payment verified, but account sync failed. Please contact support.");
            }
          });
        },
        onError: (err: any) => {
           console.error("PayPal Error:", err);
        }
      }).render(paypalRef.current);
    } catch (err) {
      console.error("Failed to render PayPal buttons:", err);
    }
  };

  if (success) {
     return (
        <div className="flex items-center justify-center min-h-[60vh] text-center">
           <div className="space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/30">
                 <CheckCircle size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">License Activated</h2>
                <p className="text-zinc-500 mt-2">Enterprise protocols engaged. Reloading terminal...</p>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
          Activate Your <br /> <span className="text-blue-500">Defense Terminal</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Secure node upgrade for Organization: <span className="text-white font-mono">{orgId}</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Enterprise Capabilities</h3>
            <p className="text-zinc-500 text-sm">Unlock the full power of the Atlas AI engine.</p>
          </div>
          <div className="grid gap-6">
            {[
              { icon: <Zap className="text-blue-500" />, title: "Unlimited AI Audits", desc: "Remove the 5-quote cap. Process high-volume batches." },
              { icon: <ShieldCheck className="text-emerald-500" />, title: "Priority Processing", desc: "Skip the queue with dedicated GPU allocation." },
              { icon: <CheckCircle className="text-indigo-500" />, title: "Dispute Automation", desc: "Generate legal-grade dispute letters instantly." }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-blue-500/30 transition-colors">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-widest">{benefit.title}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed mt-1 font-medium">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 text-zinc-950 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <CreditCard size={120} className="text-black" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Monthly License</div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter">$199</span>
              <span className="text-zinc-500 text-xl font-black">USD</span>
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              + Applicable Taxes
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Secure Checkout via PayPal
            </div>
            
            <div ref={paypalRef} className="w-full relative z-20 min-h-[150px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;