import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const CategoriesSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          {/* Expense Categories */}
          <div>
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div>
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
