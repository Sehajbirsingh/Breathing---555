import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface BreathingControlsProps {
  isActive: boolean;
  isSoundEnabled: boolean;
  onToggleActive: () => void;
  onToggleSound: () => void;
}

export function BreathingControls({
  isActive,
  isSoundEnabled,
  onToggleActive,
  onToggleSound,
}: BreathingControlsProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleActive}
        className="w-12 h-12"
      >
        {isActive ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSound}
        className="w-12 h-12"
      >
        {isSoundEnabled ? (
          <Volume2 className="h-6 w-6" />
        ) : (
          <VolumeX className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
