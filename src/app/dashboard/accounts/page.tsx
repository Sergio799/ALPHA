'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, PlusCircle, TrendingUp, Wallet, Trash2 } from "lucide-react";
import { LinkAccountDialog } from '@/components/dashboard/LinkAccountDialog';

const mockAccounts = [
    {
        id: '1',
        institution: 'Chase Bank',
        name: 'Checking',
        mask: '1234',
        balance: 5420.11,
        type: 'depository',
    },
    {
        id: '2',
        institution: 'Fidelity',
        name: 'Brokerage Account',
        mask: '5678',
        balance: 88324.50,
        type: 'investment',
    },
    {
        id: '3',
        institution: 'Coinbase',
        name: 'Digital Wallet',
        mask: '9012',
        balance: 18450.75,
        type: 'crypto',
    },
    {
        id: '4',
        institution: 'Bank of America',
        name: 'Savings',
        mask: '3456',
        balance: 25000.00,
        type: 'depository',
    },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).format(value);

const AccountIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'investment':
            return <TrendingUp className="w-6 h-6 text-primary" />;
        case 'crypto':
            return <Wallet className="w-6 h-6 text-primary" />;
        default:
            return <Landmark className="w-6 h-6 text-primary" />;
    }
}


export default function AccountsPage() {
    const [accounts, setAccounts] = useState(mockAccounts);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

    const handleDeleteAccount = (accountId: string) => {
        setAccounts(accounts.filter((acc) => acc.id !== accountId));
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
                        <Landmark className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white font-sans">Linked Accounts</h1>
                </div>
                <Button onClick={() => setIsLinkDialogOpen(true)} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-sans">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    Link New Account
                </Button>
            </div>

            <p className="text-base text-gray-400 mb-8 max-w-2xl font-sans">
                Connect your external bank and brokerage accounts to get a complete, unified view of your financial life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <Card key={account.id} className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
                                        <AccountIcon type={account.type} />
                                    </div>
                                    <span className="text-lg text-white font-sans">{account.institution}</span>
                                </div>
                                <Button
                                    size="icon"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    className="h-8 w-8 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-sm font-sans">{account.name} •••• {account.mask}</p>
                            <p className="text-3xl font-bold mt-3 text-white font-sans">
                                {formatCurrency(account.balance)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                <Card
                    onClick={() => setIsLinkDialogOpen(true)}
                    className="bg-white/5 backdrop-blur-md border-white/10 border-dashed hover:bg-white/10 hover:border-primary/50 transition-all flex items-center justify-center min-h-[190px] cursor-pointer shadow-xl"
                >
                    <div className="text-center">
                        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20 w-fit mx-auto mb-3">
                            <PlusCircle className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-white font-sans">Link New Account</p>
                    </div>
                </Card>
            </div>
            <LinkAccountDialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen} />
        </div>
    );
}
