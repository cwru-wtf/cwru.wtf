import Link from "next/link"
import { ArrowRight, Code, Cpu, Rocket, Zap, Wrench, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import WtfMeanings from "@/components/wtf-meanings"
import SubmissionForm from "@/components/submission-form"

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
            <p className="mt-6 text-xl text-gray-300">
              <span className="font-bold text-green-400">We Tinker Fearlessly.</span> A collective of CWRU students
              building the future (or just building cool stuff).
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button className="bg-green-500 text-black hover:bg-green-400">
                Join .wtf <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-mono text-3xl font-bold text-white sm:text-4xl">What is cwru.wtf?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-300">
            We're a student-led collective for builders, tinkerers, and dreamers at Case Western Reserve University.
            This isn't a club where we talk about doing things. It's where we actually do them.
          </p>

          <WtfMeanings />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
              <Zap className="h-10 w-10 text-green-400" />
              <h3 className="mt-4 font-mono text-xl font-bold text-white">Build Anything</h3>
              <p className="mt-2 text-gray-400">
                Hardware hacks, AI experiments, open-source tools, weird websites, game dev—anything that makes you say
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

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="Smart Mirror"
              description="A Raspberry Pi-powered mirror that displays weather, calendar, and news while you get ready."
              tags={["Hardware", "Python", "IoT"]}
              image="/placeholder.svg?height=200&width=400"
              icon={<Cpu className="h-5 w-5" />}
            />
            <ProjectCard
              title="Course Scheduler"
              description="AI-powered tool to help CWRU students plan their perfect class schedule."
              tags={["Web", "AI", "Student Life"]}
              image="/placeholder.svg?height=200&width=400"
              icon={<Code className="h-5 w-5" />}
            />
            <ProjectCard
              title="Drone Delivery"
              description="Autonomous drone system for delivering small packages across campus."
              tags={["Robotics", "C++", "Hardware"]}
              image="/placeholder.svg?height=200&width=400"
              icon={<Rocket className="h-5 w-5" />}
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
      <section className="bg-gradient-to-b from-black to-gray-900 py-20">
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
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Discord</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
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
