import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  phone: z.string().min(10, "Valid phone number required").max(20),
  email: z.string().email("Valid email required").max(255),
  postcode: z.string().min(3, "Postcode required").max(10),
  service: z.string().min(1, "Please select a service"),
  location: z.string().min(1, "Please select a location"),
  message: z.string().max(1000).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  sourcePage: string;
  defaultService?: string;
  defaultLocation?: string;
  compact?: boolean;
}

export function LeadForm({ sourcePage, defaultService, defaultLocation, compact = false }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      service: defaultService || "",
      location: defaultLocation || "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        postcode: data.postcode,
        service: data.service,
        location: data.location,
        message: data.message || "",
        source_page: sourcePage,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Thank you! We'll be in touch shortly.");
      reset();
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <CheckCircle2 className="h-16 w-16 mx-auto text-trust mb-4" />
        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          We've received your enquiry and will get back to you as soon as possible.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsSuccess(false)}
        >
          Submit Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div>
          <Input
            placeholder="Your Name *"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Input
            placeholder="Phone Number *"
            type="tel"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Input
            placeholder="Email Address *"
            type="email"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input
            placeholder="Postcode *"
            {...register("postcode")}
            className={errors.postcode ? "border-destructive" : ""}
          />
          {errors.postcode && <p className="text-destructive text-sm mt-1">{errors.postcode.message}</p>}
        </div>

        <div>
          <Select onValueChange={(value) => setValue("service", value)} defaultValue={defaultService}>
            <SelectTrigger className={errors.service ? "border-destructive" : ""}>
              <SelectValue placeholder="Select Service *" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {SERVICES.map((service) => (
                <SelectItem key={service.slug} value={service.slug}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && <p className="text-destructive text-sm mt-1">{errors.service.message}</p>}
        </div>

        <div>
          <Select onValueChange={(value) => setValue("location", value)} defaultValue={defaultLocation}>
            <SelectTrigger className={errors.location ? "border-destructive" : ""}>
              <SelectValue placeholder="Select Area *" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {LOCATIONS.map((location) => (
                <SelectItem key={location.slug} value={location.slug}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message}</p>}
        </div>
      </div>

      {!compact && (
        <div>
          <Textarea
            placeholder="Describe your drainage issue (optional)"
            rows={4}
            {...register("message")}
          />
        </div>
      )}

      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Get Your Free Quote"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We'll respond within 30 minutes during business hours
      </p>
    </form>
  );
}
