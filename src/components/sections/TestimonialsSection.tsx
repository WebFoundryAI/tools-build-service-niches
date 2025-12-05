import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Swindon",
    rating: 5,
    text: "Fantastic service! They arrived within the hour and had our blocked drain cleared in no time. Very professional and reasonably priced.",
  },
  {
    name: "David T.",
    location: "Royal Wootton Bassett",
    rating: 5,
    text: "Called on a Sunday with an emergency and they came straight out. Can't recommend them enough. Will definitely use again.",
  },
  {
    name: "Emma L.",
    location: "Highworth",
    rating: 5,
    text: "Very impressed with the CCTV survey. They explained everything clearly and fixed the issue same day. Great value for money.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about our service.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl card-elevated animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 mb-4 italic">"{testimonial.text}"</p>
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-muted-foreground">{testimonial.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
