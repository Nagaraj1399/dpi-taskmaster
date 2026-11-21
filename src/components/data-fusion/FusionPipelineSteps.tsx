import React from 'react';
import { Activity, DollarSign, Radio, Users, type LucideIcon } from 'lucide-react';
import type { BricsCountry } from '../../shared/types';
import { SUBTLE_PANEL_CLASS } from '../ui/styles';

interface PipelineStep {
  code: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  codeColor: string;
  iconColor: string;
}

interface FusionPipelineStepsProps {
  currentCountry: BricsCountry;
}

/** Displays the 4-stage citizen telemetry to public investment fusion pipeline. */
export const FusionPipelineSteps: React.FC<FusionPipelineStepsProps> = ({ currentCountry }) => {
  const agencyShortName = currentCountry.censusAgency.split(' ')[0] ?? currentCountry.censusAgency;

  const steps: readonly PipelineStep[] = [
    {
      code: '01. INGESTION',
      title: 'Voice & Messaging Ingestion',
      subtitle: 'Voice IVR, WhatsApp, SMS',
      icon: Radio,
      codeColor: 'text-emerald-700',
      iconColor: 'text-emerald-600',
    },
    {
      code: '02. CENSUS',
      title: 'Demographic Overlay',
      subtitle: `${agencyShortName} Board`,
      icon: Users,
      codeColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      code: '03. INDICES',
      title: 'Infrastructure Baseline',
      subtitle: 'Roads, Water, Health, Net',
      icon: Activity,
      codeColor: 'text-cyan-700',
      iconColor: 'text-cyan-600',
    },
    {
      code: '04. BUDGET',
      title: 'Public Investment Align',
      subtitle: 'Capital Program Outlay',
      icon: DollarSign,
      codeColor: 'text-amber-800',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.code} className={`${SUBTLE_PANEL_CLASS} p-3`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold font-mono ${step.codeColor}`}>
                  {step.code}
                </span>
                <Icon className={`w-3.5 h-3.5 ${step.iconColor}`} aria-hidden="true" />
              </div>
              <div className="text-xs font-bold text-slate-900">{step.title}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">{step.subtitle}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
