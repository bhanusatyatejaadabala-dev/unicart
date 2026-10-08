import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2 text-body-sm font-body text-text-secondary">
        <li className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary-light p-1 rounded-sm"
          >
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-text-muted mx-1" />
              {isLast ? (
                <span className="text-text font-medium truncate max-w-[180px] md:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-primary transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-primary-light p-1 rounded-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
