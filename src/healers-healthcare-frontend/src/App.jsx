

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import { ThemeProvider } from "../src/components/ThemeProvider/theme-provider"
// import LandingPage from "./pages/LandingPage/LandingPage";
import Ehr from "./pages/EhrPage/EhrPage";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";
import InventoryPage from "./pages/Inventory/InventoryPage";
import Appointments from "./pages/Appointments/Appointments";
import PatientDetails from "./components/PatientRecord1";
import MedicalHistory from "./components/MedicalHistory";
import TestReport from "./components/TestReport";
import DoctorAppointments from "./pages/DoctorPages/AppointmentsPage/DoctorAppointments";
import LoginSignup from "./pages/Login-Signup/Login-Signup";
import Dashboard from "./pages/DashboardPage/Dashboard";
import InternetIdentity from "./pages/Login-Signup/InternetIdentity"
import PlugWallet from "./pages/Login-Signup/PlugWallet"
import MetaMaskAuth from "./pages/Login-Signup/Metamask"


function App() {

  const router = createBrowserRouter([
    
    // other pages....
    {
      path: "/",
      element: <LoginSignup />,

    },
    {
      path: "/login",
      element: <LoginSignup />,

    },
    {
      path: "/internetidentity",
      element:<InternetIdentity/>
    },
    {
      path: "/plugwallet",
      element:<PlugWallet/>
    },
    {
      path: "/metamask",
      element:<MetaMaskAuth/>
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    // other pages....
    {
      path: "/health-records",
      element: <Ehr />,
    },
    {
      path: "/doctor-dashboard",
      element: <DoctorDashboard />,
    },

    {
      path: "/inventory",
      element: <InventoryPage />,
    },
    

    {
      path: "/appointments",
      element: <Appointments />,
    },
    {
      path: "/patient/:id",
      element: <PatientDetails />
    },
    {
      path: "/patient/:id/medical-history",
      element: <MedicalHistory />
    },
    {
      path: "/patient/:id/test-report",
      element: <TestReport />
    },
    {
      path:"/doctor-appointments",
      element: <DoctorAppointments />
    },

    {
      path: "*",
      
      element: <h1>404</h1>,
    }


  ])


  return (
    <div className="overflow-hidden">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <RouterProvider router={router} />
      </ThemeProvider>

      
    </div>
  )
}

export default App;