import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, GanttChart, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sectorPredictions = [
  {
    name: "Technology",
    outlook: "Bullish",
    confidence: 85,
    catalysts: ["AI advancements", "Strong earnings"],
  },
  {
    name: "Healthcare",
    outlook: "Bullish",
    confidence: 78,
    catalysts: ["New drug approvals", "Aging population"],
  },
  {
    name: "Consumer Discretionary",
    outlook: "Neutral",
    confidence: 62,
    catalysts: ["Mixed consumer spending data", "Inflation concerns"],
  },
  {
    name: "Energy",
    outlook: "Bearish",
    confidence: 70,
    catalysts: ["Geopolitical tensions easing", "Increased supply"],
  },
  {
    name: "Financials",
    outlook: "Neutral",
    confidence: 65,
    catalysts: ["Stable interest rates", "Regulatory uncertainty"],
  },
   {
    name: "Real Estate",
    outlook: "Bearish",
    confidence: 75,
    catalysts: ["High interest rates", "Cooling housing market"],
  },
];

const PredictionIcon = ({ outlook }: { outlook: string }) => {
  switch (outlook) {
    case "Bullish":
      return <TrendingUp className="h-5 w-5 text-green-400" />;
    case "Bearish":
      return <TrendingDown className="h-5 w-5 text-red-400" />;
    default:
      return <Minus className="h-5 w-5 text-gray-400" />;
  }
};


export default function PredictionsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <GanttChart className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-sans">Market Predictions</h1>
          <p className="text-gray-400 text-base font-sans">
            AI-powered sector forecasts for the next 3-6 months
          </p>
        </div>
      </div>

      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="bg-gray-800/30 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-white font-sans">AI-Powered Sector Forecast (Next 3-6 Months)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300 font-semibold font-sans">Sector</TableHead>
                  <TableHead className="text-gray-300 font-semibold font-sans">Outlook</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-300 font-semibold font-sans">Confidence</TableHead>
                  <TableHead className="hidden sm:table-cell text-gray-300 font-semibold font-sans">Key Catalysts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectorPredictions.map((pred) => (
                  <TableRow key={pred.name} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white font-sans">{pred.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-white/10">
                          <PredictionIcon outlook={pred.outlook} />
                        </div>
                        <Badge
                          className={`font-sans ${
                            pred.outlook === "Bullish"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : pred.outlook === "Bearish"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}
                        >
                          {pred.outlook}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                       <div className="flex items-center gap-3">
                          <span className="text-white font-semibold font-sans min-w-[40px]">{pred.confidence}%</span>
                          <div className="w-24 h-2.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-2.5 bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500" 
                                style={{width: `${pred.confidence}%`}}
                              ></div>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-300 font-sans">{pred.catalysts.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
