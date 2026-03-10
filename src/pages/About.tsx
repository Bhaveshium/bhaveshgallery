import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import portraitImg from "@/assets/gallery/bhavesh-2.png";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const About = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your inquiry. I'll get back to you soon.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <SEO
        title="About - Bhavesh Chaudhari"
        description="Learn about Bhavesh Chaudhari — data enthusiast and photographer capturing compelling imagery."
        canonicalUrl="/about"
      />

      <PortfolioHeader activeCategory="" />
      
      <main className="min-h-screen">
        <section className="max-w-[1600px] mx-auto pt-20 pb-12 md:pt-24 md:pb-16">
          <div className="text-center space-y-8 mb-16 px-3 md:px-5 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h1 className="font-playfair text-4xl md:text-5xl text-foreground">
                Bhavesh Chaudhari
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter">
                DATA & PHOTOGRAPHY
              </p>
            </div>

            <div className="max-w-xs mx-auto border border-foreground/10 overflow-hidden">
              <img
                src={portraitImg}
                alt="Bhavesh Chaudhari"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-3 md:px-5 space-y-8 text-center text-foreground/80 text-sm leading-relaxed mb-16">
            <p>
              Photographer and data enthusiast blending analytical thinking with creative vision.
              Capturing compelling imagery that tells stories through light, composition, and emotion.
            </p>

            <div className="pt-8">
              <h2 className="font-playfair text-xl text-foreground mb-4">What I Do</h2>
              <p className="text-foreground/70 text-xs uppercase tracking-wider leading-loose">
                Portrait Photography / Story Telling / Automotive / Creative Direction / Data & Analytics
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-xl mx-auto px-3 md:px-5 pt-16">
            <div className="text-center space-y-4 mb-12">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter">INQUIRIES</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-foreground">Contact</h2>
              <p className="text-foreground/80 text-sm leading-relaxed">For project inquiries and collaborations.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-inter">Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" className="border-0 border-b border-foreground/20 rounded-none bg-transparent text-foreground px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-inter">Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" className="border-0 border-b border-foreground/20 rounded-none bg-transparent text-foreground px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-inter">Message *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell me about your project..." className="border-0 border-b border-foreground/20 rounded-none bg-transparent text-foreground min-h-[150px] px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="pt-4 text-center">
                  <Button type="submit" disabled={isSubmitting} variant="outline" className="w-full md:w-auto px-12 py-6 text-sm uppercase tracking-widest font-inter border-foreground/40 hover:bg-foreground hover:text-background transition-all">
                    {isSubmitting ? "Sending..." : "Send"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </>
  );
};

export default About;
