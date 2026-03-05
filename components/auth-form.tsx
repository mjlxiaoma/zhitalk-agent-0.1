import Form from "next/form";

import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label
          className="font-semibold text-sm text-foreground"
          htmlFor="email"
        >
          邮箱地址
        </Label>

        <Input
          autoComplete="email"
          autoFocus
          className="bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 text-base h-12 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
          defaultValue={defaultEmail}
          id="email"
          name="email"
          placeholder="your@email.com"
          required
          type="email"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label
          className="font-semibold text-sm text-foreground"
          htmlFor="password"
        >
          密码
        </Label>

        <Input
          className="bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 text-base h-12 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
          id="password"
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />
      </div>

      {children}
    </Form>
  );
}
