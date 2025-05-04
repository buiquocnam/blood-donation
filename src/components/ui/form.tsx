import * as React from "react";
import { useFormContext } from "react-hook-form";

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement> & {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  }
>(({ className, onSubmit, ...props }, ref) => (
  <form
    ref={ref}
    onSubmit={onSubmit}
    className={className}
    {...props}
  />
));
Form.displayName = "Form";

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`space-y-2 ${className}`}
    {...props}
  />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div
    ref={ref}
    className="mt-2"
    {...props}
  />
));
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    name?: string;
  }
>(({ className, name, ...props }, ref) => {
  const { formState } = useFormContext() || { formState: {} };
  const error = name ? formState?.errors?.[name] : null;

  if (!error) return null;

  return (
    <p
      ref={ref}
      className={`text-sm font-medium text-destructive ${className}`}
      {...props}
    >
      {error?.message?.toString() || props.children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

const FormField = ({
  name,
  control,
  render,
}) => {
  const { formState } = useFormContext() || { formState: {} };
  
  const fieldState = name ? {
    invalid: Boolean(formState.errors?.[name]),
    isDirty: Boolean(formState.dirtyFields?.[name]),
    error: formState.errors?.[name],
  } : {};
  
  const field = {
    name,
    value: control?.getValues?.(name) || '',
    onChange: (value) => control?.setValue?.(name, value),
  };
  
  return render({ field, fieldState });
};

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField
}; 