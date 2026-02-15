import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Code, Cpu, Rocket, Zap, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import WtfMeanings from "@/components/wtf-meanings"
import SubmissionForm from "@/components/submission-form"
import GlitchyWtfText from "@/components/glitchy-wtf-text"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/cled-bg.png" 
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              cwru.wtf
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
              <span className="text-green-500">cwru</span>
              <span className="text-pink-500">.wtf</span>
            </h1>
            <GlitchyWtfText />
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A student-led collective for builders, tinkerers, and dreamers at Case Western Reserve University.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/80 px-8 py-3 font-mono text-sm" asChild>
                <Link href="#join">
                  Join .wtf <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full border-border text-foreground hover:bg-muted px-8 py-3 font-mono text-sm" asChild>
                <Link href="#about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              What We Do
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              What is cwru.wtf?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl">
              This isn&apos;t a club where we talk about doing things (we are in fact not a club!).
              It&apos;s where we actually do them. Hardware hacks, AI experiments, art installations,
              films, open-source tools, weird websites&mdash;anything that makes you say &ldquo;wtf, I wanna try that.&rdquo;
            </p>
          </div>

          <WtfMeanings />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <Zap className="h-6 w-6 text-green-500" />
              <h3 className="font-serif text-xl font-bold">Build Anything</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hardware hacks, AI experiments, large scale art, films, open-source tools, weird websites, game dev&mdash;anything goes.
              </p>
            </div>
            <div className="space-y-4">
              <Wrench className="h-6 w-6 text-pink-500" />
              <h3 className="font-serif text-xl font-bold">Learn by Doing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No experience required. Just curiosity and a willingness to build. We learn through projects, not lectures.
              </p>
            </div>
            <div className="space-y-4">
              <Rocket className="h-6 w-6 text-yellow-500" />
              <h3 className="font-serif text-xl font-bold">Ship It</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We host late-night build sessions, mentor each other, and collaborate on projects that make us excited.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-border" />
      </div>

      {/* Projects Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Projects
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Featured Projects
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed text-lg">
              Check out what our members have been building. From hardware to software, from practical to just-for-fun.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            <ProjectCard
              title="FPGA Multilayer Perceptron"
              description='Taking custom "AI" onto custom hardware! Designing and implementing a Neural Network directly on FPGA for high-speed, low-latency classification.'
              tags={["FPGA", "AI", "Hardware", "Neural Networks"]}
              image="/perceptrona.jpg"
              icon={<Cpu className="h-5 w-5" />}
              link=""
              status="pending"
            />

            <ProjectCard
              title="CWRU Games"
              description={`Games made by CWRU students, for CWRU students. \n From wordle to full game theory economic simulations.`}
              tags={["Software", "Web", "NextJS"]}
              image="/wordle.png"
              icon={<Code className="h-5 w-5" />}
              link="https://games.cwru.wtf"
              status="complete"
            />

            <ProjectCard
              title="*WTF Supercomputer"
              description="A compute cluster made of donated compute from CWRU student's actual machines; For AI or High performance computing?"
              tags={["Distributed systems", "AI", "Hardware"]}
              image="wt-compute.png"
              icon={<Cpu className="h-5 w-5" />}
              link=""
              status="in-progress"
            />

            <ProjectCard
              title="Interactive Art"
              description="An interactive art installation that responds to environmental stimuli; creating an ever-evolving visual experience."
              tags={["Art", "Electronics", "Hardware"]}
              image="kinetic.png"
              icon={<Wrench className="h-5 w-5" />}
              link=""
              status="pending"
            />
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="rounded-full border-border hover:bg-muted font-mono text-sm px-8">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-border" />
      </div>

      {/* Join Section */}
      <section id="join" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Join Us
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Join cwru.wtf
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Ready to build something awesome? Join our community of makers, hackers, and creators.
            </p>
          </div>

          <SubmissionForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-6 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-xl font-bold">
                <span className="text-green-500">cwru</span>
                <span className="text-pink-500">.wtf</span>
              </span>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} cwru.wtf
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
