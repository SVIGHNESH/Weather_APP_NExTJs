'use client';

import React, { useState } from 'react';
import { WeatherData } from '@/types/weather';

interface AlertsBannerProps {
  weather: WeatherData | null;
}

export function AlertsBanner({ weather }: AlertsBannerProps) {
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  if (!weather?.alerts || weather.alerts.length === 0) {
    return null;
  }

  const visibleAlerts = weather.alerts.filter(alert => !dismissedAlertIds.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  const getAlertColor = (type: string): { bg: string; border: string; icon: string } => {
    const lower = type.toLowerCase();
    if (lower.includes('severe') || lower.includes('warning') || lower.includes('tornado')) {
      return { bg: 'bg-red-50', border: 'border-red-400', icon: '🔴' };
    }
    if (lower.includes('heat') || lower.includes('extreme') || lower.includes('frost')) {
      return { bg: 'bg-orange-50', border: 'border-orange-400', icon: '🟠' };
    }
    // Advisory or other warnings
    return { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: '🟡' };
  };

  const getTextColor = (type: string): string => {
    const lower = type.toLowerCase();
    if (lower.includes('severe') || lower.includes('warning') || lower.includes('tornado')) {
      return 'text-red-800';
    }
    if (lower.includes('heat') || lower.includes('extreme') || lower.includes('frost')) {
      return 'text-orange-800';
    }
    return 'text-yellow-800';
  };

  const handleDismiss = (id: string) => {
    setDismissedAlertIds(prev => new Set([...prev, id]));
  };

  return (
    <div className="space-y-2 mb-6">
      {visibleAlerts.map(alert => {
        const colors = getAlertColor(alert.type);
        const textColor = getTextColor(alert.type);
        const startTime = new Date(alert.startTime).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const endTime = new Date(alert.endTime).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={alert.id}
            className={`${colors.bg} border-l-4 ${colors.border} rounded p-4 flex items-start gap-3 ${textColor}`}
          >
            <span className="text-2xl flex-shrink-0">{colors.icon}</span>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{alert.type}</h3>
                  <p className="text-sm mt-1">{alert.description}</p>
                  <p className="text-xs opacity-75 mt-2">
                    {startTime} - {endTime}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity text-2xl"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
