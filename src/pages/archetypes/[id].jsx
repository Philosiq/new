import React from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaStar,
  FaLightbulb,
  FaUsers,
  FaComments,
} from "react-icons/fa";

export default function ArchetypeDetail() {
  const router = useRouter();
  const { id } = router.query;

  const archetypes = {
    utopian: {
      id: "the-utopian",
      name: "The Utopian",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
      introduction:
        "As an ELPSG (The Utopian), you likely envision a world shaped by fairness, freedom, and progress. You tend to support reducing economic inequality, protecting personal liberties, and embracing change as a path toward a better future. With a generally secular outlook and a broad, global perspective, you often see cooperation and innovation as important tools for addressing the world’s challenges. Your ideal society is probably one where individuals can thrive without oppressive systems, and where justice is thoughtfully balanced with opportunity.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-blue-600 to-green-500",
    },
    reformer: {
      id: "reformer",
      name: "The Reformer",
      // Other fields will go here
    },
    prophet: {
      id: "prophet",
      name: "The Prophet",
      // Other fields will go here
    },
    firebrand: {
      id: "firebrand",
      name: "The Firebrand",
      // Other fields will go here
    },
    philosopher: {
      id: "philosopher",
      name: "The Philosopher",
      // Other fields will go here
    },
    localist: {
      id: "localist",
      name: "The Localist",
      // Other fields will go here
    },
    missionary: {
      id: "missionary",
      name: "The Missionary",
      // Other fields will go here
    },
    guardian: {
      id: "guardian",
      name: "The Guardian",
      // Other fields will go here
    },
    technocrat: {
      id: "technocrat",
      name: "The Technocrat",
      // Other fields will go here
    },
    enforcer: {
      id: "enforcer",
      name: "The Enforcer",
      // Other fields will go here
    },
    zealot: {
      id: "zealot",
      name: "The Zealot",
      // Other fields will go here
    },
    purist: {
      id: "purist",
      name: "The Purist",
      // Other fields will go here
    },
    commander: {
      id: "commander",
      name: "The Commander",
      // Other fields will go here
    },
    steward: {
      id: "steward",
      name: "The Steward",
      // Other fields will go here
    },
    shepherd: {
      id: "shepherd",
      name: "The Shepherd",
      // Other fields will go here
    },
    highPriest: {
      id: "high-priest",
      name: "The High Priest",
      // Other fields will go here
    },
    futurist: {
      id: "futurist",
      name: "The Futurist",
      // Other fields will go here
    },
    maverick: {
      id: "maverick",
      name: "The Maverick",
      // Other fields will go here
    },
    evangelist: {
      id: "evangelist",
      name: "The Evangelist",
      // Other fields will go here
    },
    dissenter: {
      id: "dissenter",
      name: "The Dissenter",
      // Other fields will go here
    },
    globalist: {
      id: "globalist",
      name: "The Globalist",
      // Other fields will go here
    },
    patriot: {
      id: "patriot",
      name: "The Patriot",
      // Other fields will go here
    },
    industrialist: {
      id: "industrialist",
      name: "The Industrialist",
      // Other fields will go here
    },
    traditionalist: {
      id: "traditionalist",
      name: "The Traditionalist",
      // Other fields will go here
    },
    overlord: {
      id: "overlord",
      name: "The Overlord",
      // Other fields will go here
    },
    corporatist: {
      id: "corporatist",
      name: "The Corporatist",
      // Other fields will go here
    },
    moralizer: {
      id: "moralizer",
      name: "The Moralizer",
      // Other fields will go here
    },
    builder: {
      id: "builder",
      name: "The Builder",
      // Other fields will go here
    },
    executive: {
      id: "executive",
      name: "The Executive",
      // Other fields will go here
    },
    ironhand: {
      id: "ironhand",
      name: "The Ironhand",
      // Other fields will go here
    },
    crusader: {
      id: "crusader",
      name: "The Crusader",
      // Other fields will go here
    },
  };

  const archetype = archetypes[id];

  if (!archetype) {
    return (
      <Layout title="Loading Archetype - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading archetype information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${archetype.name} - Political Archetype | PhilosiQ`}>
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/archetypes"
              className="inline-flex items-center text-secondary-darkBlue hover:text-primary-maroon transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to All Archetypes
            </Link>
          </div>

          {/* Hero section */}
          <div
            className={`bg-gradient-to-r ${archetype.color} text-white rounded-lg shadow-lg p-8 mb-8`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {archetype.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {archetype.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-white/20 px-3 py-1 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <p className="text-xl">{archetype.description}</p>
              </div>
              <div className="mt-6 md:mt-0 w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                {/* Placeholder for archetype icon/image */}
                <span className="text-6xl font-bold">
                  {archetype.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Axis positions */}
          {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue">
              Political Axis Positions
            </h2>
            <div className="space-y-6">
              {archetype.axisPositions.map((axis, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{axis.axis}</span>
                    <span className="text-sm text-gray-500">
                      {axis.description}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        axis.axis.includes("Equality")
                          ? "bg-blue-500"
                          : axis.axis.includes("Democracy")
                          ? "bg-green-500"
                          : axis.axis.includes("Progress")
                          ? "bg-purple-500"
                          : axis.axis.includes("Secular")
                          ? "bg-yellow-500"
                          : axis.axis.includes("Military")
                          ? "bg-red-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${axis.position}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{axis.axis.split(" vs. ")[1]}</span>
                    <span>{axis.axis.split(" vs. ")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Introduction */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-secondary-darkBlue flex items-center">
                  <FaLightbulb className="mr-3 text-primary-maroon" />{" "}
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {archetype.introduction}
                </p>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue">
                  Strengths and Weaknesses
                </h2>

                <h3 className="text-xl font-semibold mb-4 text-green-600">
                  Strengths
                </h3>
                <ul className="mb-8 space-y-2">
                  {archetype.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-red-600">
                  Weaknesses
                </h3>
                <ul className="space-y-2">
                  {archetype.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Famous People */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue flex items-center">
                  <FaUsers className="mr-3 text-primary-maroon" /> Famous People
                </h2>
                <div className="space-y-8">
                  {archetype.famousPeople.map((person, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-32 h-32 mb-4 overflow-hidden flex items-center justify-center">
                        {person.image ? (
                          <img
                            src={person.image}
                            alt={person.name}
                            className="w-full h-auto"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-400">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{person.name}</h3>
                      <p className="text-gray-600 text-sm">{person.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Axis Breakdown Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Axis Breakdown
            </h2>

            <div className="space-y-8">
              {/* Markets vs. Equality */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-600">
                  Markets: The Power of Individual Enterprise and Competition
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.markets ||
                    "Success is not handed out; it is earned. High achievers understand that individual effort, innovation, and competition are the engines of economic growth and personal success. They believe in a merit-based system where those who provide the most value rise to the top. Rather than waiting for permission or relying on external help, they take control of their own destiny, leveraging their skills, knowledge, and work ethic to create opportunities."}
                </p>
              </div>

              {/* Democracy vs. Authority */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">
                  Democracy: Freedom as the Cornerstone of Opportunity
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.democracy ||
                    "A thriving society—and by extension, a thriving business environment—depends on the ability of individuals to make choices, voice opinions, and pursue their ambitions without unnecessary interference. Those who succeed recognize that freedom, accountability, and fair competition foster innovation and long-term prosperity. They value a system where effort and ability determine outcomes, not arbitrary barriers."}
                </p>
              </div>

              {/* Secular vs. Religious */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-600">
                  Secular Rationality: Logic and Inclusivity Drive Growth
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.secular ||
                    "Decisions must be based on rational analysis, not dogma. The most effective leaders and entrepreneurs embrace evidence-based thinking, ensuring that policies, strategies, and business decisions are guided by logic, inclusivity, and real-world data. They understand that success requires adaptability and a willingness to engage with diverse perspectives to solve complex problems."}
                </p>
              </div>

              {/* Nationalism vs. Globalism */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-red-600">
                  Nationalism: Strength Through Self-Reliance
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.nationalism ||
                    "Independence breeds resilience. Whether at the level of an individual, a business, or a nation, true power comes from the ability to stand on one's own, rather than depending on external forces. The most successful people and organizations take ownership of their outcomes, cultivate internal strength, and focus on sustainable long-term prosperity. They build systems, businesses, and skill sets that allow them to thrive, regardless of external challenges."}
                </p>
              </div>

              {/* Progress vs. Tradition */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-purple-600">
                  Progress: The Relentless Drive for Innovation
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.progress ||
                    "Success is built on the ability to adapt, evolve, and push forward. High achievers recognize that progress is not just about change for its own sake—it's about finding better, faster, and smarter ways to solve problems. They embrace technology, challenge outdated norms, and seek continuous improvement in all areas of life. Rather than being confined by the past, they forge new paths, understanding that stagnation is the enemy of success. Those who thrive in competitive markets and dynamic industries are the ones who relentlessly pursue growth, knowing that the future belongs to those willing to build it."}
                </p>
              </div>
            </div>
          </div>

          {/* Comments section (placeholder) */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue flex items-center">
              <FaComments className="mr-3 text-primary-maroon" /> Comments
            </h2>
            <div className="bg-neutral-light p-8 rounded-lg text-center">
              <p className="text-gray-600">
                Comments will be available after you create an account and log
                in.
              </p>
              <Link href="/login" className="btn-primary inline-block mt-4">
                Log In to Comment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
