import * as React from "react";
import { Circle } from "lucide-react";

interface RadioGroupProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  value: string | undefined;
  onChange: (value: string) => void;
}>({
  value: undefined,
  onChange: () => {},
});

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, defaultValue, value, onValueChange, className, ...props }, ref) => {
    const [groupValue, setGroupValue] = React.useState<string | undefined>(
      value || defaultValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setGroupValue(value);
      }
    }, [value]);

    const handleChange = React.useCallback(
      (value: string) => {
        setGroupValue(value);
        onValueChange?.(value);
      },
      [onValueChange]
    );

    return (
      <RadioGroupContext.Provider
        value={{
          value: groupValue,
          onChange: handleChange,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={`grid gap-2 ${className || ""}`}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps {
  value: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  children?: React.ReactNode;
}

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, value, disabled, id, children, ...props }, ref) => {
    const { value: groupValue, onChange } = React.useContext(RadioGroupContext);
    const checked = groupValue === value;
    const itemId = id || `radio-${value}`;

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center ${className || ""}`}
        {...props}
      >
        <input
          type="radio"
          id={itemId}
          className="sr-only"
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange(value)}
        />
        <div
          className={`aspect-square h-4 w-4 rounded-full border ${
            checked
              ? "border-blue-600 bg-blue-600"
              : "border-gray-300 bg-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {checked && (
            <div className="flex h-full items-center justify-center">
              <Circle className="h-2.5 w-2.5 fill-white text-white" />
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem }; 