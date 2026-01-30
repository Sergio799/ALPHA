'use client';

import { useState } from 'react';
import { Target, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GoalDialog, type Goal } from '@/components/dashboard/GoalDialog';

const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    target: 1000000,
    current: 250000,
    deadline: new Date('2050-12-31'),
  },
  {
    id: '2',
    name: 'Dream Vacation',
    target: 15000,
    current: 8000,
    deadline: new Date('2025-06-30'),
  },
  {
    id: '3',
    name: 'Home Down Payment',
    target: 150000,
    current: 45000,
    deadline: new Date('2028-01-15'),
  },
];


export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveGoal = (goalToSave: Goal) => {
    if (goalToSave.id) {
      setGoals(goals.map((g) => (g.id === goalToSave.id ? goalToSave : g)));
    } else {
      setGoals([
        ...goals,
        { ...goalToSave, id: new Date().toISOString(), current: 0 },
      ]);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  const openDialogForNew = () => {
    setEditingGoal(undefined);
    setIsDialogOpen(true);
  }

  const openDialogForEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white font-sans">Financial Goals</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = ((goal.current ?? 0) / goal.target) * 100;
          const formattedDeadline = goal.deadline.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          });
          return (
            <Card key={goal.id} className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-white font-sans">{goal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-white font-sans">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(goal.current ?? 0)}
                    </span>
                    <span className="text-sm text-gray-400 font-sans">
                      of{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(goal.target)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/10" />
                </div>
                <p className="text-sm text-gray-400 font-sans mb-4">
                  Deadline: {formattedDeadline}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-white/10 border-white/20 hover:bg-white/20 text-white font-sans"
                    onClick={() => openDialogForEdit(goal)}
                  >
                    Adjust Plan
                  </Button>
                  <Button
                    size="icon"
                    className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400"
                    onClick={() => handleDeleteGoal(goal.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card
          onClick={openDialogForNew}
          className="bg-white/5 backdrop-blur-md border-white/10 border-dashed hover:bg-white/10 hover:border-primary/50 transition-all flex items-center justify-center min-h-[260px] cursor-pointer shadow-xl"
        >
          <div className="text-center">
            <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20 w-fit mx-auto mb-3">
              <PlusCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-semibold text-white font-sans">Add New Goal</p>
          </div>
        </Card>
      </div>

      <GoalDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />
    </div>
  );
}
