'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Landmark, Wallet, TrendingUp, Search, Building2, CreditCard, PiggyBank, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const institutions = [
  { name: 'Robinhood', icon: TrendingUp },
  { name: 'Coinbase', icon: Wallet },
  { name: 'Fidelity', icon: BarChart3 },
  { name: 'Chase', icon: CreditCard },
  { name: 'Bank of America', icon: Building2 },
  { name: 'Charles Schwab', icon: TrendingUp },
  { name: 'Vanguard', icon: PiggyBank },
  { name: 'E*TRADE', icon: BarChart3 },
];

type LinkAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LinkAccountDialog({ open, onOpenChange }: LinkAccountDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstitutions = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInstitutionClick = (name: string) => {
    console.log(`Simulating connection to ${name}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white font-sans text-2xl">Link a New Account</DialogTitle>
          <DialogDescription className="text-gray-400 font-sans">
            Select your financial institution to connect your account.
          </DialogDescription>
        </DialogHeader>
        <div className="relative my-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
                placeholder="Search institutions..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/15 focus:border-primary/50 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {filteredInstitutions.map(({name, icon: Icon}) => (
                <Button 
                    key={name}
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-sans"
                    onClick={() => handleInstitutionClick(name)}
                >
                    <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm">{name}</span>
                </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
