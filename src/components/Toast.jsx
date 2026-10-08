import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export default function Toast() {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = "bg-surface border-border";
        let iconColor = "text-text-secondary";
        let Icon = Info;

        if (toast.type === "success") {
          bgColor = "bg-[#EEF7F2] border-[#CDE7D8]";
          iconColor = "text-success";
          Icon = CheckCircle2;
        } else if (toast.type === "warning") {
          bgColor = "bg-[#FFF9EE] border-[#FCE8C4]";
          iconColor = "text-warning";
          Icon = AlertTriangle;
        } else if (toast.type === "error") {
          bgColor = "bg-[#FDF3F1] border-[#F9D6CF]";
          iconColor = "text-error";
          Icon = XCircle;
        } else if (toast.type === "info") {
          bgColor = "bg-primary-tint-10 border-primary-light";
          iconColor = "text-primary";
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg pointer-events-auto transition-all duration-slow ease-default animate-slide-in ${bgColor}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-body-sm font-body text-text">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text p-0.5 rounded-full hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary-light"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
