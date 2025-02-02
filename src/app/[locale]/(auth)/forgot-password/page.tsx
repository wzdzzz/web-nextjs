"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { sendPasswordResetEmail } from "@/app/[locale]/(auth)/forgot-password/action"

const ForgotPasswordSchemaFn = (t?: (arg: string) => string) =>
  z.object({
    email: z.string().email({
      message: t?.("invalidEmail"),
    }),
  })

const ForgotPasswordSchema = ForgotPasswordSchemaFn()

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>

export default function ForgotPassword() {
  const t = useTranslations("forgotPassword")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchemaFn(t)),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    setLoading(true)
    try {
      const result = await sendPasswordResetEmail(values)
      setLoading(false)
      if (result?.error) {
        toast({
          title: t("sendFailed"),
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("sendSuccess"),
          description: t("sendSuccessDescription"),
        })
      }
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto mt-10 max-w-[90vw] md:max-w-md">
      <CardHeader>
        <CardTitle>{t("forgotPassword")}</CardTitle>
        <CardDescription>{t("forgotPasswordDescription")}</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mt-5">
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("emailPlaceholder")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <Button
                  size="lg"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("sendEmail")}
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
