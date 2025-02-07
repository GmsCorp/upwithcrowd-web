"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {PhoneInput} from "react-international-phone";
import "react-international-phone/style.css";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";
import {useMember} from "@/app/providers/member";

const formSchema = z.object({
  identifier: z.string(),
  mail: z.string().email("Geçerli bir e-posta adresi giriniz."),
  mobile: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Geçerli bir telefon numarası giriniz."),
  annualIncome: z.string().regex(/^\d+$/, "Yıllık gelir sadece rakam içermelidir."),
  title: z.string().optional(),
  tel: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface IndividualFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
}

export function IndividualForm({onSubmit}: IndividualFormProps) {
  const {currentMember} = useMember();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      identifier: currentMember?.identifier || "",
      mail: currentMember?.mail || "",
      mobile: currentMember?.mobile || "",
      annualIncome: String(currentMember?.annualIncome || "0"),
      title: currentMember?.title || "",
      tel: currentMember?.tel || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>ID Type</FormLabel>
            <Input value={currentMember?.idType || ""} disabled readOnly />
          </FormItem>
          <FormField
            control={form.control}
            name="identifier"
            render={({field}) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input {...field} disabled readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input value={currentMember?.name || ""} disabled readOnly />
          </FormItem>
          <FormItem>
            <FormLabel>Surname</FormLabel>
            <Input value={currentMember?.surname || ""} disabled readOnly />
          </FormItem>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mobile"
            render={({field}) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    className="w-full"
                    inputClassName="w-full"
                    countrySelectorStyleProps={{flagClassName: "pl-0.5"}}
                    defaultCountry="tr"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annualIncome"
            render={({field}) => (
              <FormItem>
                <FormLabel>Annual Income</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Enter annual income" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="mail"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {form.formState.isSubmitting ? "Updating..." : "Update Personal Account"}
        </Button>
      </form>
    </Form>
  );
}
