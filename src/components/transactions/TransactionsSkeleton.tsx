import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionsSkeleton: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl border border-border"
          >
            {/* Icon */}
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            {/* Amount and Actions */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
