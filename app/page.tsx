import Link from "next/link"
import { ArrowRight, Code, Cpu, Globe, Rocket, Zap, Wrench, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import WtfMeanings from "@/components/wtf-meanings"
import SubmissionForm from "@/components/submission-form"
import GlitchyWtfText from "@/components/glitchy-wtf-text"

export default function Home() {
  return (
    <div className="font-mono min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black" />

        <div className="container relative mx-auto px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-mono text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="text-green-400">cwru</span>
              <span className="text-pink-500">.wtf</span>
            </h1>
            <GlitchyWtfText />
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button className="bg-green-500 text-black hover:bg-green-400" asChild>
                <Link href="#join">
                  Join .wtf <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10" asChild>
                <Link href="#about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-mono text-3xl font-bold text-white sm:text-4xl">What is cwru.wtf?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-300">
            We're a student-led collective for builders, tinkerers, and dreamers at Case Western Reserve University.
            This isn't a club where we talk about doing things (we are in fact not a club!). It's where we actually do them.
          </p>

          <WtfMeanings />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
              <Zap className="h-10 w-10 text-green-400" />
              <h3 className="mt-4 font-mono text-xl font-bold text-white">Build Anything</h3>
              <p className="mt-2 text-gray-400">
                Hardware hacks, AI experiments, Large scale art, Films, open-source tools, weird websites, game dev—anything that makes you say
                "wtf, I wanna try that."
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
              <Wrench className="h-10 w-10 text-pink-500" />
              <h3 className="mt-4 font-mono text-xl font-bold text-white">Learn by Doing</h3>
              <p className="mt-2 text-gray-400">
                No experience required. Just curiosity and a willingness to build. We learn through projects, not
                lectures.
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
              <Rocket className="h-10 w-10 text-yellow-500" />
              <h3 className="mt-4 font-mono text-xl font-bold text-white">Ship It</h3>
              <p className="mt-2 text-gray-400">
                We host late-night build sessions, mentor each other, and collaborate on projects that make us excited.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-black/80 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-mono text-3xl font-bold text-white sm:text-4xl">Featured Projects</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-300">
            Check out what our members have been building. From hardware to software, from practical to just-for-fun.
          </p>

          

          <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
           
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
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-green-500/20 bg-black/50 p-8 backdrop-blur-sm sm:p-12">
            <h2 className="text-center font-mono text-3xl font-bold text-white sm:text-4xl">Join cwru.wtf</h2>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-300">
              Ready to build something awesome? Join our community of makers, hackers, and creators.
            </p>

            <SubmissionForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-6 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-xl font-bold">
                <span className="text-green-400">cwru</span>
                <span className="text-pink-500">.wtf</span>
              </span>
            </div>
           
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} cwru.wtf
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
