"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { signInWithOAuth, signInWithPassword } from "@/lib/custom-auth/actions";
import { useAuth } from "@/components/auth/custom/auth-context";
import { DynamicLogo } from "@/components/core/logo";
import { toast } from "@/components/core/toaster";


const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod.string().min(1, { message: "Password is required" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: "", password: "" } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const auth = useAuth();
  const [showPassword, setShowPassword] = React.useState<boolean>();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onAuth = React.useCallback(async (providerId: any): Promise<void> => {
    setIsPending(true);

    const { error } = await signInWithOAuth({ provider: providerId });

    if (error) {
      setIsPending(false);
      toast.error(error);
      return;
    }

    setIsPending(false);

    // Redirect to OAuth provider
  }, []);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { data, error } = await signInWithPassword(values);

      if (error) {
        setError("root", { type: "server", message: error });
        setIsPending(false);
        return;
      }

      // Update the user in the auth context so client components that depend on it can re-render.
      auth.setUser(data!.user);

      // On router refresh the sign-in page component will automatically redirect to the dashboard.
      router.refresh();
    },
    [auth, router, setError]
  );

  return (
    <Card>
      <CardHeader title="Sign in" />

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: "inline-block", fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
        </Box>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} type="email" />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(true);
                          }}
                        />
                      )
                    }
                    type={showPassword ? "text" : "password"}
                  />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button disabled={isPending} type="submit" variant="contained">
                Sign in
              </Button>
            </Box>
          </Stack>
        </form>
        <div>
          <Link component={RouterLink} href={paths.auth.custom.resetPassword} variant="subtitle2">
            Forgot password?
          </Link>
        </div>
      </CardContent>

      <Alert color="warning">
        Use{" "}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          sofia@devias.io
        </Typography>{" "}
        with password{" "}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          Secret1
        </Typography>
      </Alert>
    </Card>
  );
}
