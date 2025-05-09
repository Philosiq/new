import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaDownload,
  FaEnvelope,
  FaArrowRight,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaBug,
  FaChevronDown,
  FaChevronUp,
  FaChartPie,
  FaInfoCircle,
} from "react-icons/fa";
import ResultsProcessor from "../components/ResultsProcessor";
import AxisGraph from "../components/AxisGraph";
import DebugResultsTable from "../components/DebugResultsTable";
import MindMapContributeModal from "../components/MindMapContributeModal";

// Add this constant at the top level of the file, right after the imports
// It will be accessible to all functions in the file
const ARCHETYPE_MAP = [
  { code: "ELPSG", label: "The Utopian" },
  { code: "ELPSN", label: "The Reformer" },
  { code: "ELPRG", label: "The Prophet" },
  { code: "ELPRN", label: "The Firebrand" },
  { code: "ELCSG", label: "The Philosopher" },
  { code: "ELCSN", label: "The Localist" },
  { code: "ELCRG", label: "The Missionary" },
  { code: "ELCRN", label: "The Guardian" },
  { code: "EAPSG", label: "The Technocrat" },
  { code: "EAPSN", label: "The Enforcer" },
  { code: "EAPRG", label: "The Zealot" },
  { code: "EAPRN", label: "The Purist" },
  { code: "EACSG", label: "The Commander" },
  { code: "EACSN", label: "The Steward" },
  { code: "EACRG", label: "The Shepherd" },
  { code: "EACRN", label: "The High Priest" },
  { code: "FLPSG", label: "The Futurist" },
  { code: "FLPSN", label: "The Maverick" },
  { code: "FLPRG", label: "The Evangelist" },
  { code: "FLPRN", label: "The Dissenter" },
  { code: "FLCSG", label: "The Globalist" },
  { code: "FLCSN", label: "The Patriot" },
  { code: "FLCRG", label: "The Industrialist" },
  { code: "FLCRN", label: "The Traditionalist" },
  { code: "FAPSG", label: "The Overlord" },
  { code: "FAPSN", label: "The Corporatist" },
  { code: "FAPRG", label: "The Moralizer" },
  { code: "FAPRN", label: "The Builder" },
  { code: "FACSG", label: "The Executive" },
  { code: "FACSN", label: "The Ironhand" },
  { code: "FACRG", label: "The Regent" },
  { code: "FACRN", label: "The Crusader" },
];

export default function ResultsPage() {
  return (
    <Layout title="Your Results - PhilosiQ">
      <ResultsProcessor>
        <ResultsContent />
      </ResultsProcessor>
    </Layout>
  );
}

// Separated content component to receive processed results as props
function ResultsContent({ results }) {
  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [axisLetters, setAxisLetters] = useState({});
  const [secondaryArchetypes, setSecondaryArchetypes] = useState([]);
  const [allPercents, setAllPercents] = useState([]);
  const [showMindMapModal, setShowMindMapModal] = useState(false);

  // Get the raw data from session storage for debugging
  const [rawData, setRawData] = useState(null);

  // Check if the quiz was a full quiz or short quiz
  const [isFullQuiz, setIsFullQuiz] = useState(false);

  // Add useEffect to check quiz type when component mounts
  useEffect(() => {
    try {
      // Try to get stored quiz data from session storage first (for current session)
      let storedData = sessionStorage.getItem("quizResults");

      // If not found in sessionStorage, try localStorage
      if (!storedData) {
        storedData = localStorage.getItem("quizResults");
      }

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Check if this was a full quiz (not a short quiz)
        setIsFullQuiz(parsedData.quizType === "full");
      }
    } catch (err) {
      console.error("Error determining quiz type:", err);
    }
  }, []);

  const handleUpdate = (name, data) => {
    setAllPercents((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  console.log("this function is being called", allPercents);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("quizResults");
      if (storedData) {
        setRawData(JSON.parse(storedData));
      }
    } catch (err) {
      console.error("Error loading raw quiz data:", err);
    }
  }, []);

  // Function to handle the letter determined by each axis
  const handleLetterDetermined = (axisName, letter) => {
    setAxisLetters((prev) => ({
      ...prev,
      [axisName]: letter,
    }));
  };

  // Log the axis letters when they change and calculate secondary archetypes
  useEffect(() => {
    if (Object.keys(axisLetters).length > 0) {
      // If we have all 5 axis letters, form the code and calculate secondary archetypes
      if (Object.keys(axisLetters).length >= 5) {
        const axisOrder = [
          "Equity vs. Free Market",
          "Libertarian vs. Authoritarian",
          "Progressive vs. Conservative",
          "Secular vs. Religious",
          "Globalism vs. Nationalism",
        ];

        const archetypeCode = axisOrder
          .map((axis) => axisLetters[axis] || "?")
          .join("");

        // Set the primary archetype based on the code
        const primaryArchetype = ARCHETYPE_MAP.find(
          (entry) => entry.code === archetypeCode
        );
        if (primaryArchetype) {
          // Update the results archetype if present
          if (results && results.archetype) {
            results.archetype.name = primaryArchetype.label;
            results.archetype.code = archetypeCode;
          }
        }

        // Calculate secondary archetypes
        calculateSecondaryArchetypes(axisLetters, axisOrder);
      }
    }
  }, [axisLetters, results]);

  // Calculate secondary archetypes based on primary archetype letters
  const calculateSecondaryArchetypes = (letters, axisOrder) => {
    if (!letters || Object.keys(letters).length < 5) return;

    // Define opposite letters for each axis
    const oppositeLetters = {
      E: "F",
      F: "E", // Equity vs. Free Market
      L: "A",
      A: "L", // Libertarian vs. Authoritarian
      P: "C",
      C: "P", // Progressive vs. Conservative
      S: "R",
      R: "S", // Secular vs. Religious
      G: "N",
      N: "G", // Globalism vs. Nationalism
    };

    // Get axis percentages and categorize them
    const axisScores = {};
    const axesAt50 = []; // Axes exactly at 50%
    const axesOther = []; // All other axes

    results?.axisResults.forEach((axis) => {
      const canonicalName =
        axis.name === "Equality vs. Markets"
          ? "Equity vs. Free Market"
          : axis.name;

      axisScores[canonicalName] = axis.score;

      // Check if axis score is exactly 50%
      if (Math.abs(axis.score - 50) < 0.01) {
        // Use a small threshold to account for floating point precision
        axesAt50.push(canonicalName);
      } else {
        // Consider all other axes for flipping, not just those above 50%
        axesOther.push(canonicalName);
      }
    });

    // Prioritize axes exactly at 50% first, then add all other axes
    let axesToConsider = [...axesAt50];

    // If we don't have enough axes at exactly 50%, add in all other axes
    if (axesToConsider.length < 2) {
      axesToConsider = [...axesToConsider, ...axesOther];
    }

    // If we still don't have any axes to consider, log and return empty
    if (axesToConsider.length === 0) {
      console.log("No axes found, no secondary archetypes generated.");
      setSecondaryArchetypes([]);
      return;
    }

    // Sort axes:
    // 1. Exact 50% axes first (these are perfect candidates for flipping)
    // 2. Then sort remaining axes by closeness to 50%
    const sortedAxes = [...axesToConsider].sort((a, b) => {
      const aIs50 = axesAt50.includes(a);
      const bIs50 = axesAt50.includes(b);

      // If one is at 50% and the other isn't, prioritize the 50% one
      if (aIs50 && !bIs50) return -1;
      if (!aIs50 && bIs50) return 1;

      // If neither is at 50%, sort by closeness to 50% (absolute distance)
      if (!aIs50 && !bIs50) {
        return Math.abs(axisScores[a] - 50) - Math.abs(axisScores[b] - 50);
      }

      // If both are at 50%, keep original order
      return 0;
    });

    // Get up to 2 axes with highest priority for flipping
    const axesToFlip = sortedAxes.slice(0, Math.min(2, sortedAxes.length));

    // Create secondary archetypes by flipping the letter of the selected axes
    const secondaries = [];

    axesToFlip.forEach((axisToFlip, index) => {
      // Create a copy of the original letters
      const newLetters = { ...letters };

      // Flip the letter for the selected axis
      if (newLetters[axisToFlip]) {
        newLetters[axisToFlip] =
          oppositeLetters[newLetters[axisToFlip]] || newLetters[axisToFlip];
      }

      // Generate the code for this secondary archetype
      const secondaryCode = axisOrder
        .map((axis) => newLetters[axis] || "?")
        .join("");

      // Find the matching archetype in the array
      const archetypeEntry = ARCHETYPE_MAP.find(
        (entry) => entry.code === secondaryCode
      );
      const archetypeName = archetypeEntry
        ? archetypeEntry.label
        : "Alternative Archetype";

      // Calculate match percentage based on the score of the flipped axis
      // We need to always use the value that's less than or equal to 50% (the smaller side)
      let axisScore;
      if (allPercents[axisToFlip]) {
        const leftValue = parseFloat(
          allPercents[axisToFlip].leftPercent || "50"
        );
        const rightValue = parseFloat(
          allPercents[axisToFlip].rightPercent || "50"
        );
        // Take the smaller value (which is always <= 50%)
        axisScore = Math.min(leftValue, rightValue);
      } else {
        // Fallback if no percentages available
        axisScore = axisScores[axisToFlip] || 50;
      }

      // Use the formula: Percent Match = 100 - ((-FlippedAxisScore + 50) * 2)
      // For exactly 50%, this gives 100% match
      // For scores below 50%, the lower the score, the lower the match percentage
      let matchPercent;
      if (Math.abs(axisScore - 50) < 0.01) {
        // For scores exactly at 50%
        matchPercent = 100;
      } else {
        // Apply the formula: 100 - ((-FlippedAxisScore + 50) * 2)
        // This converts the range from 0-50 to 100-0
        matchPercent = Math.round(100 - (50 - axisScore) * 2);

        // Ensure the match percentage is between 60% and 95%
        matchPercent = Math.min(95, Math.max(60, matchPercent));
      }

      // Get traits based on the secondary archetype letters
      const traits = axisOrder.map((axis) => {
        let label = "";
        const letter = newLetters[axis];

        switch (axis) {
          case "Equity vs. Free Market":
            return letter === "E" ? "Equity" : "Free Market";
          case "Libertarian vs. Authoritarian":
            return letter === "L" ? "Libertarian" : "Authoritarian";
          case "Progressive vs. Conservative":
            return letter === "P" ? "Progressive" : "Conservative";
          case "Secular vs. Religious":
            return letter === "S" ? "Secular" : "Religious";
          case "Globalism vs. Nationalism":
            return letter === "G" ? "Globalism" : "Nationalism";
          default:
            return letter;
        }
      });

      // Create the secondary archetype object
      secondaries.push({
        name: archetypeName,
        code: secondaryCode,
        match: `${matchPercent}% match`,
        traits: traits,
        flippedAxis: axisToFlip,
        slug: archetypeName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, ""),
      });
    });

    setSecondaryArchetypes(secondaries);
  };

  // Get the user's archetype information from results
  const archetype = results
    ? {
        id: results.archetype?.code?.toLowerCase() || "unknown",
        name: results.archetype?.name || "Unknown Archetype",
        description: getArchetypeDescription(results.archetype?.name),
        traits: getAllAxisTraits(results.axisResults),
        color: getArchetypeColor(results.archetype?.name),
      }
    : null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send an API request to email the results
    console.log(`Sending results to ${userEmail}`);

    // Simulate email sending
    setTimeout(() => {
      setEmailSent(true);
    }, 1000);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF...");
    alert("PDF download functionality would be implemented here");
  };

  // If no results are passed, the ResultsProcessor component will handle it
  if (!results) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
      <div className="container-custom">
        {/* Logo for PDF sharing */}
        <div className="absolute top-28 right-8 opacity-70">
          <img src="/whitelogo.png" alt="PhilosiQ" className="h-10 w-auto" />
        </div>

        {/* Main Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Quiz Results</h1>
          <p className="text-lg text-gray-600">
            Based on your responses, we've identified your political archetype
          </p>
        </div>

        {/* Primary Archetype Card */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 text-center relative">
              {/* Top decorative elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full opacity-30 translate-x-1/2 -translate-y-1/3"></div>

              <h2 className="text-5xl font-bold mb-4 text-gray-800 relative">
                {archetype.name}
              </h2>

              {/* Display the axis letters badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {Object.keys(axisLetters).length > 0
                  ? Object.entries(axisLetters).map(([axis, letter]) => {
                      // Determine the label based on the letter
                      let label = "";
                      let bgColor = "bg-gray-200";

                      switch (axis) {
                        case "Equity vs. Free Market":
                          label = letter === "E" ? "Equity" : "Free Market";
                          bgColor =
                            letter === "E"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800";
                          break;
                        case "Libertarian vs. Authoritarian":
                          label =
                            letter === "L" ? "Libertarian" : "Authoritarian";
                          bgColor =
                            letter === "L"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-orange-100 text-orange-800";
                          break;
                        case "Progressive vs. Conservative":
                          label =
                            letter === "P" ? "Progressive" : "Conservative";
                          bgColor =
                            letter === "P"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800";
                          break;
                        case "Secular vs. Religious":
                          label = letter === "S" ? "Secular" : "Religious";
                          bgColor =
                            letter === "S"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-purple-100 text-purple-800";
                          break;
                        case "Globalism vs. Nationalism":
                          label = letter === "G" ? "Globalism" : "Nationalism";
                          bgColor =
                            letter === "G"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-red-100 text-red-800";
                          break;
                        default:
                          label = letter;
                      }

                      return (
                        <span
                          key={axis}
                          className={`${bgColor} px-4 py-1 rounded-full text-sm`}
                        >
                          {label}
                        </span>
                      );
                    })
                  : // Fall back to the original traits if axis letters not yet available
                    archetype.traits.map((trait, index) => {
                      // Determine color based on trait
                      let bgColor = "bg-gray-200";

                      if (trait === "Equity")
                        bgColor = "bg-blue-100 text-blue-800";
                      else if (trait === "Free Market")
                        bgColor = "bg-green-100 text-green-800";
                      else if (trait === "Libertarian")
                        bgColor = "bg-indigo-100 text-indigo-800";
                      else if (trait === "Authoritarian")
                        bgColor = "bg-orange-100 text-orange-800";
                      else if (trait === "Progressive")
                        bgColor = "bg-purple-100 text-purple-800";
                      else if (trait === "Conservative")
                        bgColor = "bg-blue-100 text-blue-800";
                      else if (trait === "Secular")
                        bgColor = "bg-yellow-100 text-yellow-800";
                      else if (trait === "Religious")
                        bgColor = "bg-purple-100 text-purple-800";
                      else if (trait === "Globalism")
                        bgColor = "bg-teal-100 text-teal-800";
                      else if (trait === "Nationalism")
                        bgColor = "bg-red-100 text-red-800";

                      return (
                        <span
                          key={index}
                          className={`${bgColor} px-4 py-1 rounded-full text-sm`}
                        >
                          {trait}
                        </span>
                      );
                    })}
              </div>

              {/* Description box */}
              <div className=" p-2 mb-6  max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {archetype.description}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href={`/archetypes/${archetype.id}`}
                  className="bg-red-600 text-white inline-flex items-center px-6 py-3 rounded-full transition-all hover:shadow-lg"
                >
                  Learn More About Your Archetype{" "}
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>

              {/* Bottom decorative element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-50 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
            </div>
          </div>
        </div>

        {/* Secondary Archetypes - Improved Design */}
        {secondaryArchetypes.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Your Secondary Archetypes
            </h2>
            <p className="text-center text-gray-600 mb-8">
              You also show strong alignment with these political archetypes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryArchetypes.map((archetype, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 relative">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 rounded-full opacity-30 translate-x-1/3 -translate-y-1/3"></div>

                    <div className="flex justify-between items-center relative">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {archetype.name}
                      </h3>
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        {archetype.match}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-5">
                      {archetype.traits.map((trait, i) => {
                        // Define colors for different traits
                        let bgColor = "bg-gray-200";

                        if (trait === "Equity")
                          bgColor = "bg-blue-100 text-blue-800";
                        else if (trait === "Free Market")
                          bgColor = "bg-green-100 text-green-800";
                        else if (trait === "Libertarian")
                          bgColor = "bg-indigo-100 text-indigo-800";
                        else if (trait === "Authoritarian")
                          bgColor = "bg-orange-100 text-orange-800";
                        else if (trait === "Progressive")
                          bgColor = "bg-purple-100 text-purple-800";
                        else if (trait === "Conservative")
                          bgColor = "bg-blue-100 text-blue-800";
                        else if (trait === "Secular")
                          bgColor = "bg-yellow-100 text-yellow-800";
                        else if (trait === "Religious")
                          bgColor = "bg-purple-100 text-purple-800";
                        else if (trait === "Globalism")
                          bgColor = "bg-teal-100 text-teal-800";
                        else if (trait === "Nationalism")
                          bgColor = "bg-red-100 text-red-800";

                        return (
                          <span
                            key={i}
                            className={`${bgColor} px-3 py-1 rounded-full text-sm font-medium shadow-sm`}
                          >
                            {trait}
                          </span>
                        );
                      })}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100 shadow-inner">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          Difference from primary:
                        </span>{" "}
                        Flipped position on{" "}
                        <span className="font-semibold text-blue-700">
                          {archetype.flippedAxis.replace(" vs. ", "/")}
                        </span>
                      </p>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      {getArchetypeDescription(archetype.name)}
                    </div>

                    <Link
                      href={`/archetypes/${archetype.slug}`}
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all"
                    >
                      View Details <FaArrowRight className="ml-1.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Section */}
        {rawData && (
          <div className="mb-16">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-center font-medium text-gray-700"
            >
              <FaBug className="mr-2" />
              {showDebug ? "Hide" : "Show"} Debug Information
              {showDebug ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>

            {showDebug && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-6 md:p-8">
                <DebugResultsTable
                  questions={rawData.questions}
                  answers={rawData.answers}
                  results={results}
                />
              </div>
            )}
          </div>
        )}

        {/* Axis Breakdown */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Your Political Axis Breakdown
          </h2>
          <p className="text-center text-gray-600 mb-8">
            See where you stand on each political dimension
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {results.axisResults.map((axis, index) => {
              return (
                <AxisGraph
                  key={index}
                  name={axis.name}
                  score={axis.score}
                  updatePercents={handleUpdate}
                  questions={rawData?.questions}
                  answers={rawData?.answers}
                  rawScore={axis.rawScore}
                  leftLabel={axis.leftLabel}
                  rightLabel={axis.rightLabel}
                  userPosition={axis.userPosition}
                  positionStrength={axis.positionStrength}
                  onLetterDetermined={handleLetterDetermined}
                  className={
                    index < results.axisResults.length - 1
                      ? "border-b border-gray-200 pb-6"
                      : ""
                  }
                />
              );
            })}
          </div>
        </div>

        {/* MindMap Contribute Section - Add this before the Share Results section */}
        {isFullQuiz && (
          <div className="mb-16 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-maroon to-secondary-darkBlue p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Contribute to MindMap</h2>
              <p>
                Help us understand how demographics correlate with political
                beliefs by anonymously contributing your data.
              </p>
              <p className="text-sm text-blue-600 mt-2">
                <FaInfoCircle className="inline-block mr-1" />
                This feature is exclusively available for full quiz results.
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-lg font-semibold mb-2">
                    What is MindMap?
                  </h3>
                  <p className="text-gray-600">
                    MindMap visualizes how demographic factors like age,
                    education, and location correlate with political archetypes.
                    Your anonymous contribution helps build a more comprehensive
                    picture.
                  </p>
                </div>
                <button
                  onClick={() => setShowMindMapModal(true)}
                  className="bg-primary-maroon text-white px-6 py-3 rounded-full flex items-center text-start font-medium hover:shadow-lg transition-all"
                >
                  <FaChartPie size={27} className="mr-2 min-w-10" /> Contribute
                  Anonymously
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Results */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Share Your Results
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Results */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaEnvelope className="mr-2 text-primary-maroon" /> Email
                  Results
                </h3>
                {emailSent ? (
                  <div className="text-green-600">
                    <p className="mb-2">Results sent!</p>
                    <p className="text-sm">
                      Check your inbox for your PhilosiQ results.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary-outline"
                    >
                      Send Results
                    </button>
                  </form>
                )}
              </div>

              {/* Download PDF */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaDownload className="mr-2 text-primary-maroon" /> Download
                  Results
                </h3>
                <p className="mb-4 text-sm">
                  Save your results as a PDF to reference later or share with
                  others.
                </p>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full btn-primary-outline"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold mb-4">Share on Social Media</h3>
              <div className="flex justify-center gap-4">
                <button className="p-3 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition">
                  <FaTwitter size={20} />
                </button>
                <button className="p-3 bg-[#4267B2] text-white rounded-full hover:bg-opacity-90 transition">
                  <FaFacebook size={20} />
                </button>
                <button className="p-3 bg-[#0077B5] text-white rounded-full hover:bg-opacity-90 transition">
                  <FaLinkedin size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Take Quiz Again Button */}
        <div className="text-center">
          <Link href="/quiz" className="btn-secondary inline-flex items-center">
            Take Quiz Again <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* MindMap Contribute Modal */}
      {isFullQuiz && (
        <MindMapContributeModal
          isOpen={showMindMapModal}
          onClose={() => setShowMindMapModal(false)}
          archetype={results?.archetype?.name}
          axisScores={results?.axisResults?.reduce((acc, axis) => {
            acc[axis.name] = axis.score;
            return acc;
          }, {})}
        />
      )}
    </div>
  );
}

// Helper function to extract all traits from axis results
function getAllAxisTraits(axisResults) {
  if (!axisResults || !Array.isArray(axisResults)) return [];

  return axisResults.map((axis) => {
    // FIXED: Return the OPPOSITE trait to match the archetype code
    // This is needed because we're using the opposite position for display
    const axisName = axis.name;
    const userPosition = axis.userPosition;

    // Define opposite positions for each axis
    const oppositePositions = {
      // For "Equity vs. Free Market" axis
      Equity: "Free Market",
      "Free Market": "Equity",
      // For "Libertarian vs. Authoritarian" axis
      Libertarian: "Authoritarian",
      Authoritarian: "Libertarian",
      // For "Progressive vs. Conservative" axis
      Progressive: "Conservative",
      Conservative: "Progressive",
      // For "Secular vs. Religious" axis
      Secular: "Religious",
      Religious: "Secular",
      // For "Globalism vs. Nationalism" axis
      Globalism: "Nationalism",
      Nationalism: "Globalism",
      // Handle centered positions
      Centered: "Centered",
    };

    // Use raw score to determine which side the user is actually on
    // This aligns with the archetype code that's calculated
    const rawScore = axis.rawScore;

    // Return the opposite of what was calculated
    // If rawScore is negative, we should show the right label
    // If rawScore is positive, we should show the left label
    if (rawScore < 0) {
      return axis.rightLabel;
    } else if (rawScore > 0) {
      return axis.leftLabel;
    } else {
      return "Centered"; // For scores exactly at 0
    }
  });
}

// Helper function to get a description for the archetype
function getArchetypeDescription(archetypeName) {
  const descriptions = {
    "The Corporatist":
      "You believe in economic freedom within a framework of national identity and democratic values while leaning conservative.",
    "The Maverick":
      "You value individual liberty and free markets, combined with a secular approach and strong national identity.",
    "The Steward":
      "You prioritize traditional values and market economics, with a balanced approach to authority and national sovereignty.",
    // Add more descriptions as needed
    "Unknown Archetype":
      "Your unique combination of political values doesn't fit neatly into our defined archetypes.",
  };

  return descriptions[archetypeName] || descriptions["Unknown Archetype"];
}

// Helper function to get appropriate color gradient for the archetype
function getArchetypeColor(archetypeName) {
  const colors = {
    "The Patriot": "from-red-500 to-blue-400",
    "The Maverick": "from-blue-500 to-purple-400",
    "The Steward": "from-green-500 to-blue-400",
    // Add more colors as needed
    "Unknown Archetype": "from-gray-500 to-gray-400",
  };

  return colors[archetypeName] || colors["Unknown Archetype"];
}
