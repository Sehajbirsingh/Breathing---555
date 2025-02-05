import { BreathingCircle } from "@/components/breathing-circle";
import { BreathingControls } from "@/components/breathing-controls";
import { useBreathing } from "@/lib/use-breathing";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const {
    isActive,
    currentPhase,
    phaseProgress,
    toggleActive,
    isSoundEnabled,
    toggleSound,
  } = useBreathing();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl bg-background/50 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              Breathing Exercise
            </h1>
            <p className="text-muted-foreground">
              Follow the circle for a calming 5-5-5-5 breathing pattern
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <BreathingCircle 
              isActive={isActive}
              currentPhase={currentPhase}
              phaseProgress={phaseProgress}
            />

            <BreathingControls
              isActive={isActive}
              isSoundEnabled={isSoundEnabled}
              onToggleActive={toggleActive}
              onToggleSound={toggleSound}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
