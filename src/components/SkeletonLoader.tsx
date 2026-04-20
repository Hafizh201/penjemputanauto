import { motion } from "framer-motion";

export function SkeletonLoader() {
  return (
    <div className="space-y-4 w-full" data-testid="skeleton-loader">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-12 bg-primary/20 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-6 bg-primary/20 rounded-xl col-span-2"></div>
              <div className="h-6 bg-primary/20 rounded-xl col-span-1"></div>
            </div>
            <div className="h-6 bg-primary/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
