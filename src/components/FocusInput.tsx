type FocusInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FocusInput({ value, onChange }: FocusInputProps) {
  return (
    <div className="mt-8">
      <label htmlFor="focus-input" className="text-sm font-medium text-[#526252]">
        当前专注事项
      </label>
      <input
        id="focus-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby="focus-input-hint"
        className="mt-2 h-12 w-full rounded-md border border-[#cfd8c5] bg-white px-4 text-base text-[#17211b] outline-none transition focus:border-[#4f7d5a] focus:ring-2 focus:ring-[#4f7d5a]/20"
      />
      <span id="focus-input-hint" className="mt-2 block text-xs text-[#7b8776]">
        可留空
      </span>
    </div>
  );
}
