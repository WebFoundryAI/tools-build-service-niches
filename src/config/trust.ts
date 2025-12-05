import { Shield, Clock, Award, CheckCircle2, Phone, Wrench } from "lucide-react";

export type TrustBadge = {
  icon: string;
  label: string;
  description: string;
};

export type Guarantee = {
  title: string;
  description: string;
};

export const TRUST_BADGES: TrustBadge[] = [
  {
    icon: "clock",
    label: "24/7 Emergency",
    description: "Round-the-clock availability",
  },
  {
    icon: "shield",
    label: "Fully Insured",
    description: "Complete peace of mind",
  },
  {
    icon: "award",
    label: "Local Experts",
    description: "Trusted in your area",
  },
  {
    icon: "check",
    label: "No Call-Out Fee",
    description: "Pay only for work done",
  },
];

export const GUARANTEES: Guarantee[] = [
  {
    title: "No Call-Out Charge",
    description: "You only pay for the work completed, not just for us to turn up.",
  },
  {
    title: "Fast Response Time",
    description: "We aim to be with you within 1-2 hours for emergency callouts.",
  },
  {
    title: "Fully Insured",
    description: "All our work is covered by comprehensive public liability insurance.",
  },
  {
    title: "Fixed Pricing",
    description: "The quote we give is the price you pay. No hidden charges.",
  },
  {
    title: "Satisfaction Guaranteed",
    description: "We stand behind our work with a full satisfaction guarantee.",
  },
];

export const REVIEW_PLACEHOLDER = {
  show: true,
  message: "Customer reviews coming soon. We're collecting feedback from our valued customers.",
};
