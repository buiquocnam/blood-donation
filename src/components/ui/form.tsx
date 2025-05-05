import * as React from "react";
import { useFormContext, FieldValues, ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";

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
    className={cn("space-y-2", className)}
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
    className={cn(
      "text-sm font-medium leading-none text-foreground",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
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
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {error?.message?.toString() || props.children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

// Định nghĩa interface cho FieldState thay vì import
interface CustomFieldState {
  invalid?: boolean;
  isDirty?: boolean;
  error?: any;
}

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: string;
  control?: any;
  render: (props: { 
    field: Partial<ControllerRenderProps>; 
    fieldState: CustomFieldState 
  }) => React.ReactNode;
}

const FormField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  render,
}: FormFieldProps<TFieldValues>) => {
  const { formState } = useFormContext() || { formState: {} };
  
  const fieldState: CustomFieldState = name ? {
    invalid: Boolean(formState.errors?.[name]),
    isDirty: Boolean(formState.dirtyFields?.[name]),
    error: formState.errors?.[name],
  } : {};
  
  const field = {
    name,
    value: control?.getValues?.(name) || '',
    onChange: (value: any) => control?.setValue?.(name, value),
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