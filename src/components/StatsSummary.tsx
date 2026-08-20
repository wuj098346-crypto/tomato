type StatsSummaryProps = {
  todayCompletedCount: number;
};

export function StatsSummary({ todayCompletedCount }: StatsSummaryProps) {
  return (
    <p className="mt-6 text-center text-sm font-medium text-[#526252]">
      今日完成 {todayCompletedCount} 个番茄
    </p>
  );
}
