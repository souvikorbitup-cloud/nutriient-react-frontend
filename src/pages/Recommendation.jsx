import React, { useRef } from "react";
import Button2 from "../components/Button2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import FAQSection from "../components/FAQSection";
import { useEffect } from "react";
import { useState } from "react";
import { showError } from "../Utils/toast.js";
import { getUserCompleted, getReport as fetchReport } from "../api/quiz";
import { useNavigate } from "react-router-dom";
import {
  balancedRecommendations,
  personalizedPlans,
  testimonialSlides,
} from "../variables";
import Preloder from "../sections/Preloder";

const Recommendation = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({});
  useEffect(() => {
    setLoading(true);
    const getReport = async () => {
      try {
        const resCompleted = await getUserCompleted();
        const session = resCompleted?.data?.data;
        if (!session) navigate("/quiz");
        const data = await fetchReport(session?.sessionId);
        const getData = data?.data?.data;
        if (getData?.healthAssessment > 80) {
          getData.healthAssessmentTextColor = "text-green-500";
          getData.healthAssessmentBgColor = "bg-green-500";
        } else if (getData?.healthAssessment > 40) {
          getData.healthAssessmentTextColor = "text-yellow-500";
          getData.healthAssessmentBgColor = "bg-yellow-500";
        } else {
          getData.healthAssessmentTextColor = "text-red-500";
          getData.healthAssessmentBgColor = "bg-red-500";
        }
        setReport(getData);
      } catch (error) {
        showError("No recommendation report found. Please complete the quiz.");
      } finally {
        setLoading(false);
      }
    };
    getReport();
  }, []);

  if (loading) return <Preloder />;

  const scrollToSection = (ref) => {
    if (!ref.current) return;
    const offset = 80;

    const elementTop = ref.current.getBoundingClientRect().top;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.scrollTo({
      top: elementTop + scrollTop - offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#F8F8F8] pt-24 z-20">
        <img
          src="/recomended/hero-left.svg"
          alt="icon"
          className="absolute w-[97px] h-[273px] sm:w-[268px] sm:h-[323px] rotate-[4deg] bottom-[-122px] left-[-6px]"
        />
        <div className="app-container mx-auto flex items-center min-h-[646px]">
          <div className="flex flex-col items-center gap-7 text-center max-w-[714px] mx-auto p-4">
            <div className="flex flex-col gap-6">
              <div className="text-green-1 font-bold text-lg">
                Goal: {report?.goal}
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl md:text-5xl font-bold text-nutrient-text text-t-black capitalize">
                Hi {report.userName ? report.userName : "Jhon"}!
              </h1>
            </div>

            {/* Score Display */}
            <div className="flex flex-col items-center gap-3.5 sm:gap-5">
              <div
                className={`${report.healthAssessmentTextColor} text-6xl font-bold`}
              >
                {report?.healthAssessment} / 100
              </div>
              <div className="text-t-black-light text-center">
                <p
                  className={`text-xl sm:text-2xl text-white py-2.5 px-6 ${report.healthAssessmentBgColor} rounded-full`}
                >
                  {report?.healthAssessmentTag}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-t-black text-sm font-light">
              {report?.goalTag?.normalText}{" "}
              <strong className="font-semibold">
                {report?.goalTag?.boldtext}
              </strong>
            </p>

            <div>
              <h2 className="text-center text-2xl font-semibold">
                High-impact zones:
              </h2>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-6 mb-14 sm:mb-0">
                {report?.hizValues?.map((item, i) => (
                  <span
                    className="px-6 py-2.5 rounded-full bg-dark-green text-white text-sm font-medium flex-center gap-1"
                    key={i}
                  >
                    <img src={item.image} alt="icon" />{" "}
                    <span>{item.value}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BMR & Maintenance Section */}
      <section className="pt-16 md:pt-24 bg-gradient-green z-10 relative">
        {/* bg layer */}
        <div className="bg-[linear-gradient(359deg,rgba(255,255,255,0.25)_0.98%,rgba(57,150,69,0.25)_99.02%)] h-[373px] w-full absolute top-0 left-0 z-0"></div>
        <div className="app-container mx-auto relative z-10 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-t-black mb-4">
              Your BMR & Maintenance Calories
            </h2>
            <p className="text-t-black-light mx-auto">
              Based on your weight, age, gender and activity level, we
              calculated:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-[0_0_12px_0_rgba(0,0,0,0.20)]">
              <h3 className="text-nutrient-green font-bold text-lg sm:text-2xl mb-3 text-center">
                BMR (Basal Metabolic Rate)
              </h3>
              <div className="text-2xl sm:text-5xl font-bold text-green-1 mb-4 text-center">
                {report?.bmr} kcal/day
              </div>
              <p className="text-t-black-light text-sm text-center">
                This is an estimation. You BMR will be recalculated with your
                height again in 1st consultation with more data like your height
                in cm and waist size.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-[0_0_12px_0_rgba(0,0,0,0.20)]">
              <h3 className="text-nutrient-green font-bold text-lg sm:text-2xl mb-3 text-center">
                Maintenance Calories
              </h3>
              <div className="text-2xl sm:text-5xl font-bold text-green-1 mb-4 text-center">
                {report?.maintenanceCalories} kcal/day
              </div>
              <p className="text-t-black-light text-sm text-center">
                This is the total calories you burn daily including movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-24 bg-gradient-green z-10 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-t-black text-center">
          Why this matters
        </h2>
        <div className="relative">
          <div className="bg-dark-green color-white rounded-2xl p-6 max-w-[320px] sm:max-w-2xl mx-auto mt-8 relative z-10">
            <h3 className="text-white font-normal text-lg sm:text-2xl mb-3 text-center ">
              {report?.idealTarget?.text || "Your Target:"}
            </h3>
            <div className="text-xl sm:text-4xl font-bold text-white mb-4 text-center">
              {report?.idealTarget?.low}-{report?.idealTarget?.high}{" "}
              {report?.idealTarget?.unit}
            </div>
            <p className="text-white text-sm text-center font-normal">
              This will be built into your personalized 7-day diet plan.
            </p>
          </div>
          <div className="h-2.5 bg-green-1 w-full top-1/2 z-0 absolute -translate-y-1.5"></div>
        </div>
      </section>

      {/* Root Causes Section */}
      <section className="w-full py-16">
        <div className="app-container mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-t-black">
              Root Causes
            </h2>
            <p className="mt-3 text-t-black-light text-sm md:text-base max-w-2xl mx-auto">
              Your Health Assessment Shows The Main Root Causes Behind Your
              <br className="hidden md:block" />
              Weight Struggles Appear To Be:
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {report?.rootCause.map((item, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl px-6 pt-10 pb-8
                         shadow-[0_10px_30px_rgba(0,0,0,0.08)] mt-10 sm:mt-0"
              >
                {/* Notch */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2
         w-20 h-10 bg-white rounded-b-full
         shadow-[inset_-1px_-4px_4px_0px_rgba(0,0,0,0.06)]"
                />

                {/* Icon */}
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2
                              w-10 h-10 flex items-center justify-center
                              bg-white rounded-full"
                >
                  <img src="/test/muscle.svg" alt="icon" />
                </div>

                {/* Content */}
                <h3
                  className="text-center text-2xl leading-snug font-semibold
                             text-dark-green
                             whitespace-pre-line pb-6"
                >
                  {item.title}
                </h3>

                <p
                  className="text-center text-t-black-light text-sm
                            leading-relaxed whitespace-pre-line"
                >
                  {item.descripton}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrient Personalized Plan Section */}
      <section className="pt-[100px] bg-gradient-green z-10 relative">
        {/* bg layer */}
        <div className="bg-[linear-gradient(360deg,rgba(255,255,255,0.25)_0.98%,rgba(57,150,69,0.25)_99.02%)] h-[180px] w-full absolute top-0 left-0 z-0"></div>
        <div className="app-container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-t-black">
              Your Nutrient <br /> Personalized Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 sm:order-1">
              <h3 className="text-2xl sm:text-4xl font-bold text-t-black mb-6">
                Diet, Exercise & Monitoring
              </h3>
              <div className="space-y-4">
                {personalizedPlans.map((item, i) => (
                  <div className="flex items-start gap-3" key={i}>
                    <img src={item.image} alt="icon" />
                    <p className="text-t-black-light">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-[380px] sm:h-[576px] sm:w-[584px] relative order-1 sm:order-2">
              <img
                src="/recomended/plane-img-1.png"
                alt="img"
                className="absolute bottom-0 left-0 z-10 w-[80%] "
              />
              <img
                src="/recomended/plane-img-back.png"
                alt="img"
                className="absolute top-0 right-0 z-0 w-[80%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Supplements Section */}
      <section className="py-16 md:py-24">
        <div className="app-container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-t-black">
              Your Recommended Dietary Supplements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 sm:gap-6 mx-auto mt-24">
            {/* Supplement 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(0,0,0,0.20)] flex sm:flex-col items-center sm:items-stretch justify-between">
              <div className="flex items-center justify-center">
                <img
                  src="/recomended/product-1.png"
                  alt="Probiotic"
                  className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-contain scale-175 -translate-y-9 sm:-translate-y-10"
                />
              </div>
              <div className="w-[230px] sm:w-full">
                <h3 className="text-dark-green font-bold text-xl mb-2 sm:text-center sm:mt-4">
                  Probiotic
                </h3>
                <p className="text-t-black-light sm:mb-4 sm:text-center">
                  Supports gut health and improves digestion
                </p>
              </div>
            </div>

            {/* Supplement 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(0,0,0,0.20)] flex sm:flex-col items-center sm:items-stretch justify-between">
              <div className="flex items-center justify-center order-2 sm:order-1">
                <img
                  src="/recomended/product-2.png"
                  alt="Probiotic"
                  className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-contain scale-175 -translate-y-9 sm:-translate-y-10"
                />
              </div>
              <div className="w-[230px] sm:w-full order-1 sm:order-2">
                <h3 className="text-dark-green font-bold text-xl mb-2 sm:text-center sm:mt-4">
                  Probiotic
                </h3>
                <p className="text-t-black-light sm:mb-4 sm:text-center">
                  Supports gut health and improves digestion
                </p>
              </div>
            </div>

            {/* Supplement 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_0_12px_0_rgba(0,0,0,0.20)] flex sm:flex-col items-center sm:items-stretch justify-between">
              <div className="flex items-center justify-center">
                <img
                  src="/recomended/product-3.png"
                  alt="Probiotic"
                  className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-contain scale-175 -translate-y-9 sm:-translate-y-10"
                />
              </div>
              <div className="w-[230px] sm:w-full">
                <h3 className="text-dark-green font-bold text-xl mb-2 sm:text-center sm:mt-4">
                  Probiotic
                </h3>
                <p className="text-t-black-light sm:mb-4 sm:text-center">
                  Supports gut health and improves digestion
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8 bg-white rounded-2xl p-5 sm:p-8 shadow-[0_0_12px_0_rgba(0,0,0,0.20)]">
            {/* LEFT IMAGE */}
            <div className="flex justify-center md:justify-start">
              <img
                src={report?.chartMaintenanceCalories.image}
                alt="Nutrient Personalized Diet"
                className="aspect-square w-[397px] object-contain"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex flex-col justify-center">
              {/* Title */}
              <h3 className="text-[22px] md:text-[24px] font-semibold text-dark-green leading-snug">
                Nutrient Personalized {report?.chartMaintenanceCalories.value}{" "}
                Kcal Meal Plan
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm md:text-[15px] text-t-black-light font-thin leading-relaxed">
                According To Your Health Goals And Lifestyle, We Have Designed
                This Diet Plan With Macros To Be 62% Carbohydrates, 25% Fat And
                13% Protein On {report?.chartMaintenanceCalories.value} Kcal
              </p>

              <p className="mt-2 text-sm md:text-[15px] text-t-black-light font-thin leading-relaxed">
                And It Is Balanced With All Micro Nutrients To Be Adequate For
                Your Health Requirements In Mind.
              </p>

              {/* Bullet Points */}
              <ul className="mt-4 space-y-3">
                <li className="flex gap-3 text-sm md:text-[15px] text-t-black-light font-thin">
                  <span className="mt-1 w-2.5 h-2.5 bg-[#3c9a45] rounded-sm flex-shrink-0" />
                  It Greatly Helps In Weight Loss By Enhancing Fat Metabolism,
                  Especially Around Abdominal.
                </li>

                <li className="flex gap-3 text-sm md:text-[15px] text-t-black-light font-thin">
                  <span className="mt-1 w-2.5 h-2.5 bg-[#3c9a45] rounded-sm flex-shrink-0" />
                  20:1 Ratio: 675mg Of Green Tea Leaf Extract Is Equivalent To 7
                  Cups Of Green Tea.
                </li>

                <li className="flex gap-3 text-sm md:text-[15px] text-t-black-light font-thin">
                  <span className="mt-1 w-2.5 h-2.5 bg-[#3c9a45] rounded-sm flex-shrink-0" />
                  Along With Burning Calories, It Also Helps To Regulate Bad
                  Cholesterol Levels In Our Body.
                </li>
              </ul>

              {/* Green Highlight Box */}
              <div className="mt-6 bg-[#3c9a45] rounded-xl p-5">
                <p className="text-white text-sm leading-relaxed">
                  Nutriient diet plan is designed for you with your suggested
                  dietary supplements to fulfill all your nutritional needs to
                  build immunity in this viral season and sustainability in
                  mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 relative z-10" ref={sectionRef}>
        {/* bg layer */}
        <div className="bg-[linear-gradient(360deg,rgba(255,255,255,0.25)_0.98%,rgba(57,150,69,0.25)_99.02%)] h-[180px] w-full absolute top-0 left-0 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Heading */}
          <div className="text-center mb-14 sm:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-t-black">
              {`${report.userName}'s Nutriient Personalized Kit`}
            </h2>
            <p className="mt-3 text-t-black-light text-sm md:text-base max-w-3xl mx-auto">
              Your Nutriient Journey is tailored to you—combining a structured
              diet chart, targeted supplements, and guided monitoring.
            </p>
          </div>

          {/* Pricing section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* <!-- Plan 1: Basic --> */}
            <div className="bg-white rounded-lg shadow-[0px_0px_15px_2px_rgba(0,0,0,0.1)] lg:shadow-[0px_0px_30px_10px_rgba(0,0,0,0.1)] p-6 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">Trial</h3>
              <span className="text-lg text-t-black-light/70 font-semibold line-through">
                ₹999
              </span>
              <div className="mb-6">
                <span className="text-4xl text-t-black font-semibold">
                  ₹799
                </span>{" "}
                <span className="text-sm text-t-black-light font-semibold">
                  Save 20%
                </span>
              </div>
              <p className="text-gray-600 mb-6 text-lg font-semibold underline underline-offset-8">
                One Month Plan
              </p>
              <button className="w-full bg-gray-900  text-white  py-2 px-4 rounded-md font-semibold hover:bg-gray-700  transition duration-200 mb-1 cursor-pointer">
                Select Trial Plan
              </button>
              <span className="mb-8 text-sm text-t-black-light">
                *Get Additional 10% Discount On Online Payment
              </span>
              <ul className="space-y-3 text-sm feature-list text-t-black-light  flex-grow">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Try For 1 Month Then Decide</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Free Nutritionist's Consultation</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>24/7 Support With Experts</span>
                </li>
              </ul>
              <div className="p-4 bg-black rounded-xl text-white mt-6">
                <p className="text-sm">
                  One Kit Delivered To You & One FREE Consultancuy with our
                  Nutritionists
                </p>
                <hr class="h-px my-2 bg-white/50 border-0" />
                <p className="text-sm">
                  You Can Buy Your Nutrition Plan For Following Months From Your
                  Nuitriient Dashboard
                </p>
              </div>
            </div>

            {/* <!-- Plan 2: Plus / Recommended --> */}
            <div className="bg-white  rounded-lg p-6 flex flex-col border-2 border-dark-green  relative lg:scale-110">
              <span className="absolute top-0 right-4 -mt-3 bg-dark-green  text-white  text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <h3 className="text-2xl font-semibold mb-4">Standard</h3>
              <span className="text-lg text-t-black-light/70 font-semibold line-through">
                ₹999
              </span>
              <div className="mb-6">
                <span className="text-4xl text-t-black font-semibold">
                  ₹599
                </span>{" "}
                <span className="text-sm text-t-black-light font-semibold">
                  Save 40%
                </span>
              </div>
              <p className="text-gray-600 mb-6 text-lg font-semibold underline underline-offset-8">
                Six Months Subscription
              </p>
              <button className="w-full bg-dark-green  text-white  py-2 px-4 rounded-md font-semibold hover:bg-dark-green/80  transition duration-200 mb-1 cursor-pointer">
                Select Standard Plan
              </button>
              <span className="mb-8 text-sm text-t-black-light">
                *Get Additional 10% Discount On Online Payment
              </span>
              <ul className="space-y-3 text-sm feature-list text-t-black-light  flex-grow">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Good Value For Money</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Pay Monthly Cancel Any Time</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Uninterrupted Guidance</span>
                </li>
              </ul>
              <div className="p-4 bg-dark-green rounded-xl text-white mt-6">
                <p className="text-sm">
                  One Kit Delivered Automatically Every Monthy After Your
                  Monthly Nutritionist Consultanc
                </p>
                <hr class="h-px my-2 bg-white/50 border-0" />
                <p className="text-sm">
                  Your Diet, Routine And Supplemnets Are Updated Every Month
                  According To Your Improvements And Nutritionist's Consultation
                </p>
              </div>
            </div>

            {/* <!-- Plan 3: Pro --> */}
            <div className="bg-white rounded-lg shadow-[0px_0px_15px_2px_rgba(0,0,0,0.1)] lg:shadow-[0px_0px_30px_10px_rgba(0,0,0,0.1)] p-6 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">Premium</h3>
              <span className="text-lg text-t-black-light/70 font-semibold line-through">
                ₹999
              </span>
              <div className="mb-6">
                <span className="text-4xl text-t-black font-semibold">
                  ₹499
                </span>{" "}
                <span className="text-sm text-t-black-light font-semibold">
                  Save 50%
                </span>
              </div>
              <p className="text-gray-600 mb-6 text-lg font-semibold underline underline-offset-8">
                Twelve Months Subscription
              </p>
              <button className="w-full bg-gray-900  text-white  py-2 px-4 rounded-md font-semibold hover:bg-gray-700  transition duration-200 mb-1 cursor-pointer">
                Select Premium Plan
              </button>
              <span className="mb-8 text-sm text-t-black-light">
                *Get Additional 10% Discount On Online Payment
              </span>
              <ul className="space-y-3 text-sm feature-list text-t-black-light  flex-grow">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Best Value For Money</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Uninterrupted Routine</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-dark-green mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Uninterrupted Guidance</span>
                </li>
              </ul>
              <div className="p-4 bg-black rounded-xl text-white mt-6">
                <p className="text-sm">
                  One Kit Delivered Automatically Every Monthy After Your
                  Monthly Nutritionist Consultancy
                </p>
                <hr class="h-px my-2 bg-white/50 border-0" />
                <p className="text-sm">
                  Your Diet, Routine And Supplemnets Are Updated Every Month
                  According To Your Improvements And Nutritionist's Consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Path to Balanced You Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/recomended/step.png"
                alt="Balanced Health"
                className="w-full h-auto rounded-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-t-black mb-8 text-center">
                Your Path to a Balanced & Healthier You
              </h2>

              <div className="space-y-6 mb-8">
                {balancedRecommendations.map((item, i) => (
                  <div className="flex items-start gap-4" key={i}>
                    <div className="shrink-0">
                      <img src={item.image} alt="icon" />
                    </div>
                    <p className="text-t-black-light font-thin ">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex-center">
                <Button2
                  text="Checkout Pricing Plans"
                  scrollToSection={scrollToSection}
                  sectionRef={sectionRef}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 relative z-10">
        {/* bg layer */}
        <div className="bg-[linear-gradient(360deg,rgba(255,255,255,0.25)_0.98%,rgba(57,150,69,0.25)_99.02%)] h-[180px] w-full absolute top-0 left-0 z-0"></div>
        <div className="app-container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-t-black mb-4">
              What Our Customers Say
            </h2>
            <p className="text-t-black-light max-w-3xl mx-auto">
              Your Nutrient Plan is fully personalised, medically-aligned
              lifestyle transformation program designed specifically for you.
            </p>
          </div>

          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={12}
            className="h-[520px]"
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet-r",
              bulletActiveClass: "custom-bullet-active-r",
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
            }}
          >
            {/* Testimonials */}
            {testimonialSlides.map((user, i) => (
              <SwiperSlide className="px-2 py-4" key={i}>
                <div className="bg-white rounded-2xl p-8 shadow-[0px_0px_5px_2px_rgba(0,0,0,0.1)] lg:shadow-[0px_0px_7px_4px_rgba(0,0,0,0.1)] h-[455px]">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.image}
                      alt="Achintya, Kolkata"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-lg sm:text-2xl text-t-black">
                        {user.userName}, {user.place}
                      </h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(user.noOfStars)].map((_, i) => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            key={i}
                          >
                            <path
                              d="M9.49981 2.25L11.3602 6.57L16.2765 6.915L12.5081 9.93L13.6877 14.46L9.49981 12L5.31189 14.46L6.49148 9.93L2.72314 6.915L7.63939 6.57L9.49981 2.25Z"
                              fill="#399645"
                            />
                            <path
                              d="M9.49981 2.25L7.63939 6.57L2.72314 6.915L6.49148 9.93L5.31189 14.46L9.49981 12M9.49981 2.25L11.3602 6.57L16.2765 6.915L12.5081 9.93L13.6877 14.46L9.49981 12"
                              stroke="#399645"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <h5 className=" font-medium text-xl mb-3 text-t-black">
                    {user.title}
                  </h5>
                  <p className=" text-t-black-light leading-relaxed">
                    I{user.desc}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex-center mt-12">
            <Button2
              text="Checkout Pricing Plans"
              scrollToSection={scrollToSection}
              sectionRef={sectionRef}
            />
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="pb-16 md:pb-24 relative z-10">
        {/* bg layer */}
        <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.25)_0.98%,rgba(57,150,69,0.25)_99.02%)] h-[180px] w-full absolute bottom-0 left-0 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-t-black mb-4">
              Our Team
            </h2>
            <p className="text-t-black-light max-w-3xl mx-auto">
              Your Nutrient Plan is fully personalised, medically-aligned
              lifestyle transformation program designed specifically for you.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 drop-shadow-[0_0_30px_rgba(0,0,0,0.10)] max-w-5xl mx-auto relative mt-20">
            <div className="absolute left-0 w-full flex-center -top-[63px]">
              <img
                src="/recomended/team-1.svg"
                alt="team-1"
                className="w-[126px] h-[126px] rounded-full object-cover"
              />
            </div>

            <div className="pt-18 text-center">
              <h3 className="text-2xl font-bold mb-5">
                Hi, this is{" "}
                <span className="text-dark-green">Ritambhara Mondal</span>,
              </h3>
              <p className=" text-t-black-light mb-8">
                Chief Nutritionist at Nutrient
              </p>

              <p className="text-t-black-light max-w-4xl mx-auto leading-relaxed">
                At Nutriient, we firstly know about you and your health very
                well and according to your body needs and concerns, we recommend
                you detailed diet for day-to-day life and supplements to support
                and enhance that. <br /> <br /> Our Diet and Products are
                designed in a way that you can continue for a long time even a
                lifetime with support from our professional team of
                nutritionists. <br /> <br /> Our goal is to make India
                disease-free and give a healthy lifestyle to everyone in a
                sustainable way.
              </p>

              <div className="pt-12">
                <h4 className="text-2xl font-semibold mb-6">
                  All our Health Supplements are
                </h4>
                <div className="flex justify-center gap-12 md:gap-16">
                  <img
                    src="/recomended/bage-1.png"
                    alt="ISO"
                    className="w-20 h-20"
                  />
                  <img
                    src="/recomended/bage-2.png"
                    alt="FDA"
                    className="w-20 h-20"
                  />
                  <img
                    src="/recomended/bage-3.png"
                    alt="WHO GMP"
                    className="w-20 h-20"
                  />
                </div>
                <p className="text-t-black-light font-thin">
                  That means all our products meet the international Standard
                  for Quality.
                </p>
              </div>
              <div className="pt-12">
                <h4 className="text-2xl font-semibold mb-6">
                  All Our Dietary Supplements are also
                </h4>
                <div className="flex justify-center gap-12 md:gap-16">
                  <img
                    src="/recomended/bage-4.png"
                    alt="ISO"
                    className="w-20 h-20"
                  />
                  <img
                    src="/recomended/bage-5.png"
                    alt="FDA"
                    className="w-20 h-20"
                  />
                  <img
                    src="/recomended/bage-6.png"
                    alt="WHO GMP"
                    className="w-20 h-20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-center mt-20">
            <Button2
              text="Checkout Pricing Plans"
              scrollToSection={scrollToSection}
              sectionRef={sectionRef}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-t-black mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQSection />
          <div className="flex-center mt-12">
            <Button2
              text="Checkout Pricing Plans"
              scrollToSection={scrollToSection}
              sectionRef={sectionRef}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recommendation;
