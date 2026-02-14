import Hero from "@/components/landing/Hero";
import RateCalculator from "@/components/landing/RateCalculator";

export default function Home() {
    return (
        <div className="pb-20">
            <Hero />
            <RateCalculator />

            {/* Trust Section */}
            <section className="mt-32 container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold font-heading mb-12">Trusted by Early Adopters</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Mock Logos */}
                    {['Stripe', 'Circle', 'Polygon', 'Tether'].map((name) => (
                        <div key={name} className="h-12 bg-white/5 rounded-lg flex items-center justify-center font-bold text-xl">
                            {name}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
