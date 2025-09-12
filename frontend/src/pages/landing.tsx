import Navbar from "@/components/landingPage/navbar";
import Wrapper from "../components/global/wrapper";
// import Analysis from "@/components/marketing/analysis";
import Companies from "../components/landingPage/companies";
import CTA from "../components/landingPage/cta";
import Features from "../components/landingPage/features";
import Hero from "../components/landingPage/Hero";
import Integration from "../components/landingPage/integration";
//import Pricing from "@/components/marketing/pricing";

const HomePage = () => {
    return (
        <Wrapper className="py-20 relative">
            <Hero />
            <Companies />
            <Features />
            {/* <Analysis /> */}
            <Integration />
            {/* <Pricing /> */}
            <CTA />
        </Wrapper>
    )
};

export default HomePage