import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, Tag } from "lucide-react";

export default function Badge({ status, text, count }) {
  let badgeStyles = "";
  let Icon = null;
  let labelText = text;

  switch (status) {
    case "in-stock":
      // success @ 10% opacity: #4C8A5E (rgb 76, 138, 94) -> rgba(76, 138, 94, 0.1)
      badgeStyles = "bg-success/10 text-success border-success/20";
      Icon = CheckCircle2;
      labelText = text || `In Stock ${count !== undefined ? `(${count})` : ""}`;
      break;
      
    case "low-stock":
      // warning @ 10% opacity: #C88A2E (rgb 200, 138, 46) -> rgba(200, 138, 46, 0.1)
      badgeStyles = "bg-warning/10 text-warning border-warning/20";
      Icon = AlertTriangle;
      labelText = text || `Low Stock ${count !== undefined ? `(${count} left)` : "Only few left"}`;
      break;
      
    case "out-of-stock":
      // error @ 10% opacity: #B3452C (rgb 179, 69, 44) -> rgba(179, 69, 44, 0.1)
      badgeStyles = "bg-error/10 text-error border-error/20";
      Icon = AlertOctagon;
      labelText = text || "Out of Stock";
      break;
      
    case "sale":
      badgeStyles = "bg-primary text-white border-transparent";
      Icon = Tag;
      labelText = text || "Sale";
      break;
      
    default:
      badgeStyles = "bg-primary-light text-primary border-primary-light";
      labelText = text || "";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-sm font-body text-[11px] font-semibold uppercase tracking-wider ${badgeStyles}`}>
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{labelText}</span>
    </span>
  );
}
