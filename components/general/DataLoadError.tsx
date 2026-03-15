import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export interface DataLoadErrorProps {
  /** Short title shown above the message (e.g. "Unable to load featured stories") */
  title: string;
  /** Error or status message to display */
  message: string;
  /** Called when the user clicks Retry */
  onRetry: () => void;
  /** Optional icon to show in the circle (e.g. Newspaper, Video). Defaults to AlertCircle. */
  icon?: React.ReactNode;
}

/**
 * Full-page error state when initial data fails to load. Use below all hooks
 * in the parent so it is never rendered conditionally before hooks run.
 */
export const DataLoadError = ({ title, message, onRetry, icon }: DataLoadErrorProps) => {
  const iconNode = icon ?? <AlertCircle className="w-8 h-8 text-destructive" />;

  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
        {iconNode}
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};
