import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen border-r border-border p-6 flex flex-col w-64">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
        <nav className="flex-1 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </nav>
        <Skeleton className="h-10 w-full mt-auto" />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex-1 max-w-xl">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full ml-4" />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6">
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3.5 w-3.5 rounded" />
                    </div>
                    <Skeleton className="h-6 w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-6 border-border">
              <CardHeader>
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-52" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[250px] w-full" />
              </CardContent>
            </Card>

            <Card className="mb-6 border-border">
              <CardHeader>
                <Skeleton className="h-4 w-36 mb-1" />
                <Skeleton className="h-3 w-44" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-44 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-96 border-l border-border p-6 overflow-auto space-y-6">
            <div>
              <Skeleton className="h-5 w-36 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-28 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-2 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
