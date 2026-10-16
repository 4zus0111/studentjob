"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Small react-hook-form helpers (label + input + error message).
 * Usage: <TextField form={form} name="email" label="Email" type="email" />
 */
function FieldShell({ id, label, error, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[0.8rem] font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.8rem] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({ form, name, label, hint, required, icon: Icon, className, ...props }) {
  const error = form.formState.errors[name]?.message;
  const id = `field-${name}`;

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("h-10", Icon && "pl-9", className)}
          {...form.register(name)}
          {...props}
        />
      </div>
    </FieldShell>
  );
}

export function PasswordField({ form, name, label, hint, required, icon: Icon, autoComplete, ...props }) {
  const [visible, setVisible] = useState(false);
  const error = form.formState.errors[name]?.message;
  const id = `field-${name}`;

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("h-10 pr-10", Icon && "pl-9")}
          {...form.register(name)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </FieldShell>
  );
}

export function TextareaField({ form, name, label, hint, required, rows = 4, className, ...props }) {
  const error = form.formState.errors[name]?.message;
  const id = `field-${name}`;

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <Textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("min-h-20", className)}
        {...form.register(name)}
        {...props}
      />
    </FieldShell>
  );
}

/** Native <select>: simple, accessible and works well on mobile. `options` = [{ value, label }]. */
export const SELECT_CLASS =
  "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30";

export function SelectField({ form, name, label, hint, required, options, placeholder, className, ...props }) {
  const error = form.formState.errors[name]?.message;
  const id = `field-${name}`;

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(SELECT_CLASS, className)}
        {...form.register(name)}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
