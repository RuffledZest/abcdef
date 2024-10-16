'use client'

import React, { useEffect,useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
//import { Separator } from "./ui/separator"
import { Pill, Stethoscope, Calendar, FileSymlink, FileText, Package, UserCog, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { healers_healthcare_backend } from "../../../.././src/declarations/healers-healthcare-backend";
import { idlFactory } from '../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js'
import { _SERVICE as HospitalService } from '../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did'
import { toast } from "sonner" 
import { Actor, HttpAgent } from '@dfinity/agent'
import { Toaster } from "./ui/sonner"
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl'

type MedicalHistory = {
  pharmacy: string;
  physician: string;
  event: string;
  prescription: string;
  remedies: string;
}

type Patient = {
  id: string;
  name: string;
  age: bigint;
  gender: string;
  location: string;
  blood: string;
  height: bigint;
  weight: bigint;
  medicalHistories: MedicalHistory[];
}

export default function MedicalHistory() {
  const { id } = useParams<{ id: string }>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null)

  const initializeActor = useCallback(async () => {
    try {
      const canisterId = localStorage.getItem('hospitalCanisterId')
      if (!canisterId) {
        throw new Error('Hospital canister ID not found')
      }
      console.log('Initializing actor with canister ID:', canisterId)
      const agent = new HttpAgent({ host: 'https://icp-api.io/' })
      // await agent.fetchRootKey()
      const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory,  {
        agent,
        canisterId,
      })
      console.log('Actor initialized successfully')
      setHospitalActor(actor)
    } catch (err) {
      console.error('Failed to initialize hospital actor:', err)
      setError('Failed to connect to the hospital service')
    }
  }, [])

  useEffect(() => {
    initializeActor()
  }, [initializeActor])

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!id || !hospitalActor) {
        setError('Patient ID is undefined or hospital actor not initialized')
        setIsLoading(false)
        return
      }
      try {
        const response = await hospitalActor.getPatientById(id)

        if (response && Array.isArray(response) && response.length > 0) {
          const patient = response[0]
          if (patient) {
            const formattedPatient: Patient = {
              id: patient.id,
              name: patient.name,
              age: BigInt(patient.age),
              gender: patient.gender,
              location: patient.location,
              blood: patient.blood,
              height: BigInt(patient.height),
              weight: BigInt(patient.weight),
              medicalHistories: patient.medicalHistories,
            }
            setPatientData(formattedPatient)
          } else {
            setError("Patient data is undefined")
          }
        } else {
          setError("Patient not found")
        }
      } catch (error) {
        console.error('Error fetching patient data:', error)
        setError("Failed to fetch patient data")
      } finally {
        setIsLoading(false)
      }
    }

    if (hospitalActor) {
      fetchMedicalHistory()
    }
  }, [id, hospitalActor])

  const SidebarContent = () => (
    <>
      {/* <h2 className="text-xl md:text-2xl font-bold text-[#7047eb] mb-8">Healers Healthcare</h2> */}
      <img src={'/HealersHealthcareOfficialLogo.png'} alt="Healers Healthcare" className="w-40 mx-auto" />
      <nav className="space-y-2">
        {[
          { name: 'Health Records', icon: FileText },
          { name: 'Doctor Dashboard', icon: UserCog },
          { name: 'Appointments', icon: Calendar },
          { name: 'Inventory', icon: Package },
        ].map((item, index) => (
          <React.Fragment key={item.name}>
            <Link 
              to={`/${item.name.toLowerCase().replace(' ', '-')}`} 
              className="flex items-center p-3 rounded-lg hover:bg-[#7047eb] transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 md:mr-3" />
              <span className='md:block'>{item.name}</span>
            </Link>
            {index < 3 && <div className="h-px bg-gray-700 my-2 mx-4" />}
          </React.Fragment>
        ))}
      </nav>
    </>
  )
  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }
  if (error) {
    return <div className="text-white">Error: {error}</div>
  }
  if (!patientData) {
    return <div className="text-white">No patient data found</div>
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] bg-n-8 p-4 md:p-6">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-n-8 p-4 md:p-6 space-y-8">
        <SidebarContent />
      </div>

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/health-records" className="hover:text-[#7047eb]">Health Records</Link>
          <span className="mx-2">/</span>
          <Link to={`/patient/${id}`} className="hover:text-[#7047eb]">Patient Details</Link>
          <span className="mx-2">/</span>
          <span className="text-[#7047eb]">Medical History</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">Medical History</h1>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {patientData.medicalHistories && patientData.medicalHistories.length > 0 ?(patientData.medicalHistories.map((history, index) => (
            <Card key={index} className="mb-6 text-white bg-[#131313a2] border hover:border-[#7047eb] transition duration-100">
              <CardHeader>
                <CardTitle className="text-[#fff]">Medical Report {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Pill className="text-[#7047eb]" />
                    <span>Pharmacy: {history.pharmacy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="text-[#7047eb]" />
                    <span>Physician: {history.physician}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#7047eb]" />
                    <span>Event: {history.event}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileSymlink className="text-[#7047eb]" />
                    <span>Prescription: {history.prescription}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="text-[#7047eb]" />
                    <span>Remedies: {history.remedies}</span>
                  </div>
                  {/*<div className="flex items-center gap-2">
                    <Calendar className="text-[#7047eb]" />
                    <span>Date: {history.date}</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))
        ):(
          <div className="text-white">No medical history available</div>
        )}
        </ScrollArea>
      </div>
    </div>
  )
}


  