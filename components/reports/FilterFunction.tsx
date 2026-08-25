export function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="
          text-sm
          font-bold
          text-[#3f5c80]
          dark:text-slate-300
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}
