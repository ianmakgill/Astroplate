import React from "react";

interface StatItem {
  label: string;
  value: string;
}

const StatsGrid = ({
  items,
  style = "solid",
}: {
  items: StatItem[];
  style?: "solid" | "outline";
}) => {
  return (
    <div className="my-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg p-6 text-center ${
              style === "outline"
                ? "border-2 border-primary dark:border-darkmode-primary"
                : "bg-primary dark:bg-darkmode-primary"
            }`}
          >
            <div
              className={`mb-2 text-3xl font-bold ${
                style === "outline"
                  ? "text-primary dark:text-darkmode-primary"
                  : "text-white dark:text-darkmode-body"
              }`}
            >
              {item.value}
            </div>
            <div
              className={`text-sm ${
                style === "outline"
                  ? "text-text dark:text-darkmode-text"
                  : "text-white/90 dark:text-darkmode-body/90"
              }`}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
