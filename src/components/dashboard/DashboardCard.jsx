function DashboardCard({ label, value, Icon, bgColor, change, text }) {
  return (
    <div className="flex border border-(--border) h-26 w-full rounded-xl bg-(--surface) text-(--text-primary) shadow-sm">
      <div className={`flex w-15 shrink-0 justify-center rounded-xl pt-5 ${bgColor}`}>
        <Icon className="size-7 text-white" />
      </div>

      <div className="flex h-full flex-col justify-center px-4">
        <h2 className="text-md font-bold lg:text-lg">{value}</h2>

        <p className="text-sm text-(--text-secondary)">
          {label}
        </p>

        <p className="text-sm md:text-xs">
          <span className="text-(--success)">
            {change}
          </span>{" "}
          {text}
        </p>
      </div>
    </div>
  );
}

export default DashboardCard;