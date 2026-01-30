"use client"

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

type DailyChangeProps = {
    change: number;
};

export const DailyChange = memo(function DailyChange({ change }: DailyChangeProps) {
    const isPositive = change >= 0;
    return (
        <span className={cn(
            "flex items-center font-semibold font-sans",
            isPositive ? "text-green-400" : "text-red-400"
        )}>
            {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            {Math.abs(change).toFixed(2)}%
        </span>
    );
});
