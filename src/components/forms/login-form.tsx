import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  AdminLoginSchema,
  adminLoginSchema,
  useAdminLogin,
} from "@/services/admin-login";
import { useAdminStore } from "@/stores/admin-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import McwdInputGroup from "./mcwd-input-group";

const defaultValue = {
  email: "",
  password: "",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: adminLogin } = useAdminLogin();
  const { setAccessToken } = useAdminStore();
  const router = useRouter();

  const form = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: defaultValue,
  });

  function onSubmit(data: AdminLoginSchema) {
    adminLogin(data, {
      onSuccess: (data) => {
        toast.success("Login successfully");
        console.log("login data: ", JSON.stringify(data, null, 2));
        setAccessToken(data.accessToken);
        router.replace("/admin");
      },
      onError: (error) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loginError = (error as any).response.data.message;

        toast.error(loginError || "Failed to login");
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="py-12">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="bg-primary/15 w-fit rounded-lg p-4">
            <Lock className="text-primary text-2xl" />
          </div>
          <CardTitle className="text-xl font-medium">Admin Access</CardTitle>
          <CardDescription className="text-sm">
            Metropolitan Cebu Water District
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="admin-login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <McwdInputGroup
                name="email"
                label="Email"
                placeholder="m@example.com"
                control={form.control}
                icon={Mail}
              />
              <McwdInputGroup
                name="password"
                label="Password"
                placeholder="**************"
                control={form.control}
                icon={Lock}
              />
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
