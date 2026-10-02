import React from 'react';
import { VehicleCardSkeleton } from './VehicleCardSkeleton';

interface VehicleListSkeletonProps {
  count?: number;
  gridClassName?: string;
}

export const VehicleListSkeleton: React.FC<VehicleListSkeletonProps> = ({
  count = 6,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
}) => {
  return (
    <div className={gridClassName} aria-busy="true" aria-label="در حال بارگذاری اطلاعات خودروها">
      {Array.from({ length: count }).map((_, idx) => (
        <VehicleCardSkeleton key={`veh-skeleton-${idx}`} />
      ))}
    </div>
  );
};
