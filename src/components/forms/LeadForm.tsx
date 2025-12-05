import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";
import { BRAND } from "@/config/brand";
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
import { Loader2, CheckCircle2, Copy } from "lucide-react";

// UK phone number validation regex
const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:\d\s?){9,10})$/;

const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Please enter a valid name"),
  phone: z
    .string()
    .min(10, "Valid UK phone number required")
    .max(20)
    .refine(
      (val) => ukPhoneRegex.test(val.replace(/\s/g, "")),
      "Please enter a valid UK phone number"
    ),
  email: z
    .string()
    .email("Valid email required")
    .max(255, "Email must be less than 255 characters"),
  postcode: z
    .string()
    .min(3, "Postcode required")
    .max(10)
    .regex(
      /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i,
      "Please enter a valid UK postcode"
    ),
  service: z.string().min(1, "Please select a service"),
  location: z.string().min(1, "Please select a location"),
  message: z.string().max(1000).optional(),
  // Honeypot field - should remain empty
  website: z.string().max(0).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  sourcePage: string;
  defaultService?: string;
  defaultLocation?: string;
  compact?: boolean;
}

export function LeadForm({
  sourcePage,
  defaultService,
  defaultLocation,
  compact = false,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string>("");

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
      website: "", // Honeypot
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    // Check honeypot - if filled, silently reject
    if (data.website && data.website.length > 0) {
      // Fake success to not alert bots
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        postcode: data.postcode.trim().toUpperCase(),
        service: data.service,
        location: data.location,
        message: data.message?.trim() || "",
        source_page: sourcePage,
      });

      if (error) throw error;

      // Generate a simple reference ID
      const ref = `REF-${Date.now().toString(36).toUpperCase()}`;
      setReferenceId(ref);

      setIsSuccess(true);
      toast.success("Thank you! We'll be in touch shortly.");
      reset();
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error(
        "Something went wrong. Please try again or call us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    navigator.clipboard.writeText(referenceId);
    toast.success("Reference copied!");
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <CheckCircle2 className="h-16 w-16 mx-auto text-trust mb-4" />
        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          We have received your enquiry and will get back to you as soon as
          possible.
        </p>

        {referenceId && (
          <div className="bg-muted p-3 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              Your reference number:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="font-mono font-bold">{referenceId}</code>
              <button
                onClick={copyReference}
                className="p-1 hover:bg-background rounded"
                aria-label="Copy reference"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          Need urgent help? Call us now:
        </p>
        <a
          href={`tel:${BRAND.phone}`}
          className="text-lg font-bold text-primary hover:underline"
        >
          {BRAND.phone}
        </a>

        <Button
          variant="outline"
          className="mt-6 block mx-auto"
          onClick={() => {
            setIsSuccess(false);
            setReferenceId("");
          }}
        >
          Submit Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot field - hidden from users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <Input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div
        className={
          compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"
        }
      >
        <div>
          <Input
            placeholder="Your Name *"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
            aria-label="Your name"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Phone Number *"
            type="tel"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
            aria-label="Phone number"
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Input
            placeholder="Email Address *"
            type="email"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
            aria-label="Email address"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            placeholder="Postcode *"
            {...register("postcode")}
            className={errors.postcode ? "border-destructive" : ""}
            aria-label="Postcode"
          />
          {errors.postcode && (
            <p className="text-destructive text-sm mt-1">
              {errors.postcode.message}
            </p>
          )}
        </div>

        <div>
          <Select
            onValueChange={(value) => setValue("service", value)}
            defaultValue={defaultService}
          >
            <SelectTrigger
              className={errors.service ? "border-destructive" : ""}
              aria-label="Select service"
            >
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
          {errors.service && (
            <p className="text-destructive text-sm mt-1">
              {errors.service.message}
            </p>
          )}
        </div>

        <div>
          <Select
            onValueChange={(value) => setValue("location", value)}
            defaultValue={defaultLocation}
          >
            <SelectTrigger
              className={errors.location ? "border-destructive" : ""}
              aria-label="Select area"
            >
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
          {errors.location && (
            <p className="text-destructive text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      {!compact && (
        <div>
          <Textarea
            placeholder="Describe your drainage issue (optional)"
            rows={4}
            {...register("message")}
            aria-label="Message"
          />
        </div>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
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
        We will respond within 30 minutes during business hours
      </p>
    </form>
  );
}
