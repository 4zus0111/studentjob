"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
