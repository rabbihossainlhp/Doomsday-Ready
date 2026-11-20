import { Check } from 'lucide-react';

export default function CustomCheckbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] transition ${
        checked ? 'bg-[#f59e0b] text-[#07111e]' : 'bg-white text-transparent hover:bg-slate-200'
      }`}
    >
      <Check className="h-3 w-3 stroke-[3]" />
    </button>
  );
}