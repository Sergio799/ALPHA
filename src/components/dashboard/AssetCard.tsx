"use client"

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Asset } from '@/lib/portfolio-data';
import { DailyChange } from './DailyChange';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(value);

type AssetCardProps = {
  asset: Asset;
  totalValue: number;
};

export const AssetCard = memo(function AssetCard({ asset, totalValue }: AssetCardProps) {
  return (
    <Card className="hover:bg-accent">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>{asset.name}</span>
          <Badge variant="outline">{asset.symbol}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Value</p>
          <p className="font-semibold">{formatCurrency(asset.value)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Price</p>
          <p className="font-semibold">{formatCurrency(asset.price)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Daily Change</p>
          <DailyChange change={asset.daily_change_percent} />
        </div>
        <div>
          <p className="text-muted-foreground">Shares</p>
          <p className="font-semibold">{asset.shares.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Allocation</p>
          <p className="font-semibold">{((asset.value / totalValue) * 100).toFixed(2)}%</p>
        </div>
      </CardContent>
    </Card>
  );
});
