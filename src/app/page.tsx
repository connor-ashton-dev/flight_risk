"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Plane,
  User,
  MapPin,
  Cloud,
  Settings,
  RotateCcw,
} from "lucide-react";

interface RiskFactor {
  id: string;
  label: string;
  value: boolean;
  score: number;
  category: "pilot" | "conditions" | "airport" | "vfr" | "ifr" | "approach";
}

export default function FlightRiskAssessment() {
  const [pilotType, setPilotType] = useState<"VFR" | "IFR">("VFR");
  const [experienceLevel, setExperienceLevel] = useState<">100" | "<100">(
    "<100",
  );

  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    // Pilot factors
    {
      id: "pilot-hours-aircraft",
      label: "Less than 50 Hours in Aircraft or Avionics Type",
      value: false,
      score: 5,
      category: "pilot",
    },
    {
      id: "pilot-hours-90days",
      label: "Less than 15 hours in the last 90 days",
      value: false,
      score: 3,
      category: "pilot",
    },
    {
      id: "pilot-after-work",
      label: "Flight will occur after work",
      value: false,
      score: 4,
      category: "pilot",
    },
    {
      id: "pilot-sleep",
      label: "Less than 8 hours sleep prior to flight",
      value: false,
      score: 5,
      category: "pilot",
    },
    {
      id: "pilot-instruction",
      label: "Dual Instruction Received in last 90 days",
      value: false,
      score: -1,
      category: "pilot",
    },
    {
      id: "pilot-wings",
      label: "WINGS Phase Completion in last 6 months",
      value: false,
      score: -3,
      category: "pilot",
    },
    {
      id: "pilot-instrument",
      label: "Instrument Rating current and proficient",
      value: false,
      score: -3,
      category: "pilot",
    },

    // Flight Conditions
    {
      id: "conditions-twilight",
      label: "Twilight or Night",
      value: false,
      score: 5,
      category: "conditions",
    },
    {
      id: "conditions-surface-wind",
      label: "Surface wind greater than 15 Knots",
      value: false,
      score: 4,
      category: "conditions",
    },
    {
      id: "conditions-cross-wind",
      label: "Cross wind greater than 7 Knots",
      value: false,
      score: 4,
      category: "conditions",
    },
    {
      id: "conditions-terrain",
      label: "Mountainous Terrain",
      value: false,
      score: 4,
      category: "conditions",
    },

    // Airport
    {
      id: "airport-towered",
      label: "Non-towered Airport or tower closed at ETD or ETA",
      value: false,
      score: 5,
      category: "airport",
    },
    {
      id: "airport-runway-length",
      label: "Runway length less than 3,000 Feet",
      value: false,
      score: 3,
      category: "airport",
    },
    {
      id: "airport-runway-surface",
      label: "Wet or soft field Runway",
      value: false,
      score: 3,
      category: "airport",
    },
    {
      id: "airport-obstacles",
      label: "Obstacles on Approach and/or departure",
      value: false,
      score: 3,
      category: "airport",
    },

    // VFR Flight Plan
    {
      id: "vfr-ceiling",
      label: "Ceiling less than 3,000 feet AGL",
      value: false,
      score: 2,
      category: "vfr",
    },
    {
      id: "vfr-visibility",
      label: "Visibility less than 5 SM",
      value: false,
      score: 2,
      category: "vfr",
    },
    {
      id: "vfr-plan-filed",
      label: "Flight Plan filed and activated",
      value: false,
      score: -2,
      category: "vfr",
    },
    {
      id: "vfr-weather-reporting",
      label: "No Weather Reporting at destination",
      value: false,
      score: 4,
      category: "vfr",
    },
    {
      id: "vfr-atc-following",
      label: "ATC Flight Following used",
      value: false,
      score: -3,
      category: "vfr",
    },

    // IFR Flight Plan
    {
      id: "ifr-ceiling",
      label: "Ceiling less than 1000 feet AGL",
      value: false,
      score: 2,
      category: "ifr",
    },
    {
      id: "ifr-visibility",
      label: "Visibility less than 3 SM",
      value: false,
      score: 2,
      category: "ifr",
    },
    {
      id: "ifr-weather-reporting",
      label: "No Weather Reporting at destination",
      value: false,
      score: 4,
      category: "ifr",
    },

    // Approaches
    {
      id: "approach-precision",
      label: "Precision Approach",
      value: false,
      score: -2,
      category: "approach",
    },
    {
      id: "approach-non-precision",
      label: "Non precision Approach",
      value: false,
      score: 3,
      category: "approach",
    },
    {
      id: "approach-no-instrument",
      label: "No Instrument Approach",
      value: false,
      score: 4,
      category: "approach",
    },
    {
      id: "approach-circling",
      label: "Circling Approach",
      value: false,
      score: 7,
      category: "approach",
    },
  ]);

  const toggleRiskFactor = (id: string) => {
    setRiskFactors((prev) =>
      prev.map((factor) =>
        factor.id === id ? { ...factor, value: !factor.value } : factor,
      ),
    );
  };

  const resetForm = () => {
    setRiskFactors((prev) =>
      prev.map((factor) => ({ ...factor, value: false })),
    );
  };

  const calculateTotalRisk = () => {
    return riskFactors
      .filter((factor) => factor.value)
      .reduce((total, factor) => total + factor.score, 0);
  };

  const getRiskLevel = (score: number) => {
    // Define thresholds based on pilot type and experience
    const thresholds = {
      IFR: {
        "<100": {
          lowMax: 25,
          moderateMax: 30,
        },
        ">100": {
          lowMax: 30,
          moderateMax: 35,
        },
      },
      VFR: {
        "<100": {
          lowMax: 15,
          moderateMax: 20,
        },
        ">100": {
          lowMax: 20,
          moderateMax: 25,
        },
      },
    };

    const currentThresholds = thresholds[pilotType][experienceLevel];

    if (score <= currentThresholds.lowMax)
      return {
        level: "Low Risk",
        color: "bg-green-500",
        textColor: "text-green-700",
      };
    if (score <= currentThresholds.moderateMax)
      return {
        level: "Moderate Risk",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
      };
    return {
      level: "High Risk",
      color: "bg-red-500",
      textColor: "text-red-700",
    };
  };

  const totalRisk = calculateTotalRisk();
  const riskAssessment = getRiskLevel(totalRisk);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pilot":
        return <User className="h-4 w-4" />;
      case "conditions":
        return <Cloud className="h-4 w-4" />;
      case "airport":
        return <MapPin className="h-4 w-4" />;
      case "vfr":
      case "ifr":
        return <Plane className="h-4 w-4" />;
      case "approach":
        return <Settings className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "pilot":
        return "Pilot Factors";
      case "conditions":
        return "Flight Conditions";
      case "airport":
        return "Airport Factors";
      case "vfr":
        return "VFR Flight Plan";
      case "ifr":
        return "IFR Flight Plan";
      case "approach":
        return "Approach Types";
      default:
        return "Risk Factors";
    }
  };

  const groupedFactors = riskFactors.reduce(
    (acc, factor) => {
      if (!acc[factor.category]) acc[factor.category] = [];
      acc[factor.category].push(factor);
      return acc;
    },
    {} as Record<string, RiskFactor[]>,
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Flight Risk Assessment Tool
            </h1>
            <p className="text-muted-foreground mt-2">
              Check the applicable factors to assess your flight risk level
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex gap-2">
              <select
                value={pilotType}
                onChange={(e) => setPilotType(e.target.value as "VFR" | "IFR")}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="VFR">VFR Pilot</option>
                <option value="IFR">IFR Pilot</option>
              </select>

              <select
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(e.target.value as ">100" | "<100")
                }
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="<100">&lt;100 Hours In Type</option>
                <option value=">100">&gt;100 Hours In Type</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={resetForm}
              className="gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Risk Factors */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedFactors).map(([category, factors]) => (
              <Card key={category}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getCategoryIcon(category)}
                    {getCategoryTitle(category)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {factors.map((factor) => (
                      <div
                        key={factor.id}
                        onClick={() => toggleRiskFactor(factor.id)}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={factor.value}
                          readOnly
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring pointer-events-none"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium leading-5">
                            {factor.label}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                factor.score > 0 ? "destructive" : "good"
                              }
                              className="text-xs"
                            >
                              {factor.score > 0 ? "+" : ""}
                              {factor.score}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {Math.max(totalRisk, 0)}
                  </div>
                  <Badge
                    className={`${riskAssessment.color} text-white px-4 py-2 text-sm font-semibold`}
                  >
                    {riskAssessment.level}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span className="font-medium">
                      {Math.max(totalRisk, 0)}
                    </span>
                  </div>
                  <Progress
                    value={Math.max((totalRisk / 78) * 100, 0)}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="p-2 bg-muted rounded-md mb-2">
                    <div className="font-medium text-foreground">
                      {pilotType} Pilot -{" "}
                      {experienceLevel === "<100" ? "< 100" : "> 100"} Hours in
                      Type
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Risk:</span>
                    <span>
                      0-
                      {pilotType === "IFR"
                        ? experienceLevel === "<100"
                          ? "25"
                          : "30"
                        : experienceLevel === "<100"
                        ? "15"
                        : "20"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moderate Risk:</span>
                    <span>
                      {pilotType === "IFR"
                        ? experienceLevel === "<100"
                          ? "26-30"
                          : "31-35"
                        : experienceLevel === "<100"
                        ? "16-20"
                        : "21-25"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk:</span>
                    <span>
                      {pilotType === "IFR"
                        ? experienceLevel === "<100"
                          ? "31+"
                          : "36+"
                        : experienceLevel === "<100"
                        ? "21+"
                        : "26+"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
