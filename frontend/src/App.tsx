import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ChatPage from "./pages/chatPage";
import Profile from "./pages/profile";
import Pricing from "./pages/pricing";
import NotFound from "./pages/notFound";
import Navbar from "./components/landingPage/navbar";
import { ToastContainer } from "react-toastify";
import DetailsPage from "./pages/detailsPage";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      {/* Show Navbar only on `/` */}
      {location.pathname === "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/chat/:frameId" element={<ChatPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details" element={<DetailsPage/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
