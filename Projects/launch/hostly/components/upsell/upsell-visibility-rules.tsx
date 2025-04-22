// components/UpsellVisibilityRules.tsx
'use client';

import NewVisibilityRuleModal from './NewVisibilityRuleModal';

export interface UpsellVisibilityRule {
  id: number;
  rule_type: string;
  value: number;
  unit: string;
}

interface UpsellVisibilityRulesProps {
  rules: UpsellVisibilityRule[];
  // Optional callback to update the parent state when a new rule is added.
  onNewRule?: (rule: UpsellVisibilityRule) => void;
}

export default function UpsellVisibilityRules({ rules, onNewRule }: UpsellVisibilityRulesProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Visibility Rules</h2>
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 flex gap-2 border rounded shadow">
            <p>
              {rule.value} {rule.unit}
            </p>
            <p className="font-bold">{rule.rule_type}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <NewVisibilityRuleModal onNewRule={onNewRule} />
      </div>
    </div>
  );
}
