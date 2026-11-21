import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type {
  BricsCountry,
  InvestmentSector,
  ProgramStatus,
  PublicInvestmentProgram,
} from '../../../shared/types';
import { COMPACT_INPUT_CLASS, PRIMARY_BUTTON_CLASS, SUBTLE_PANEL_CLASS } from '../../ui/styles';
import { SliderField, TextField } from '../fields/SharedFields';

const SECTOR_OPTIONS: readonly InvestmentSector[] = [
  'Roads & Highways',
  'Water & Sanitation',
  'Healthcare',
  'Digital & Power',
  'Education',
];

const STATUS_OPTIONS: readonly ProgramStatus[] = [
  'On Track',
  'Delayed',
  'Critical Review',
  'Completed',
];

interface InvestmentTabProps {
  formData: BricsCountry;
  onUpdateInvestment: <K extends keyof BricsCountry['publicInvestment']>(
    field: K,
    value: BricsCountry['publicInvestment'][K]
  ) => void;
  onAddProgram: () => void;
  onRemoveProgram: (index: number) => void;
  onUpdateProgram: <K extends keyof PublicInvestmentProgram>(
    index: number,
    field: K,
    value: PublicInvestmentProgram[K]
  ) => void;
}

/** Public investment budget and capital program editing tab within the Dataset Studio modal. */
export const InvestmentTab: React.FC<InvestmentTabProps> = ({
  formData,
  onUpdateInvestment,
  onAddProgram,
  onRemoveProgram,
  onUpdateProgram,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-2">
      <div>
        <h3 className="text-sm font-bold text-slate-900">
          Public Investment &amp; Capital Outlay Programs
        </h3>
        <p className="text-xs text-slate-600">
          Define budget allocations and match citizen grievances to official procurement lines.
        </p>
      </div>
      <button type="button" onClick={onAddProgram} className={PRIMARY_BUTTON_CLASS}>
        <Plus className="w-3.5 h-3.5" />
        <span>Add Program</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField
        id="investment-total-budget"
        label="Total Capital Budget Outlay"
        value={formData.publicInvestment.totalBudgetUSD}
        onChange={(val) => onUpdateInvestment('totalBudgetUSD', val)}
        placeholder="e.g. $134.2 Billion"
        mono
      />

      <SliderField
        id="investment-disbursement-rate"
        label="National Disbursement Rate"
        value={formData.publicInvestment.disbursementRate}
        onChange={(val) => onUpdateInvestment('disbursementRate', val)}
        step={0.1}
        valueDisplay={`${formData.publicInvestment.disbursementRate}%`}
      />
    </div>

    <div className="space-y-3">
      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        Active Capital Works Programs ({formData.publicInvestment.topPrograms.length}):
      </div>

      {formData.publicInvestment.topPrograms.length === 0 ? (
        <div className={`${SUBTLE_PANEL_CLASS} p-4 text-xs text-slate-600`}>
          No programs configured. At least one capital program is required to pass validation.
        </div>
      ) : (
        formData.publicInvestment.topPrograms.map((prog, idx) => {
          const nameId = `program-name-${idx}`;
          const budgetId = `program-budget-${idx}`;
          const sectorId = `program-sector-${idx}`;
          const statusId = `program-status-${idx}`;
          return (
            <div key={idx} className={`${SUBTLE_PANEL_CLASS} p-4 space-y-3`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor={nameId} className="block text-[11px] font-bold text-slate-700">
                    Program Name (Official)
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    value={prog.name}
                    onChange={(e) => onUpdateProgram(idx, 'name', e.target.value)}
                    className={COMPACT_INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor={budgetId} className="block text-[11px] font-bold text-slate-700">
                    Budget Outlay
                  </label>
                  <input
                    id={budgetId}
                    type="text"
                    value={prog.budgetUSD}
                    onChange={(e) => onUpdateProgram(idx, 'budgetUSD', e.target.value)}
                    className={`${COMPACT_INPUT_CLASS} font-mono`}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor={sectorId} className="block text-[11px] font-bold text-slate-700">
                    Sector
                  </label>
                  <select
                    id={sectorId}
                    value={prog.sector}
                    onChange={(e) =>
                      onUpdateProgram(idx, 'sector', e.target.value as InvestmentSector)
                    }
                    className={COMPACT_INPUT_CLASS}
                  >
                    {SECTOR_OPTIONS.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 flex items-end justify-between md:col-span-2 gap-2">
                  <div className="w-full">
                    <label
                      htmlFor={statusId}
                      className="block text-[11px] font-bold text-slate-700"
                    >
                      Status
                    </label>
                    <select
                      id={statusId}
                      value={prog.status}
                      onChange={(e) =>
                        onUpdateProgram(idx, 'status', e.target.value as ProgramStatus)
                      }
                      className={COMPACT_INPUT_CLASS}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveProgram(idx)}
                    aria-label={`Remove program ${prog.name}`}
                    className="p-2 text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);
