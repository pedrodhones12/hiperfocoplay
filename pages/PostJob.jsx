import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Briefcase, Building2, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PostJobPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  
  const [companyProfile, setCompanyProfile] = useState({
    company_name: "",
    description: "",
    website: "",
    industry: "",
    size: "51-200",
    location: "",
    neurodiversity_program: {
      has_program: false,
      program_name: "",
      description: "",
      accommodations_offered: []
    },
    contact_email: ""
  });

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: [],
    benefits: [],
    job_type: "remoto",
    accessibility_features: [],
    salary_range: "",
    sector: "tecnologia"
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [accessibilityInput, setAccessibilityInput] = useState("");
  const [accommodationInput, setAccommodationInput] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setCompanyProfile(prev => ({ ...prev, contact_email: currentUser.email }));
      } catch (error) {
        console.error("Erro:", error);
      }
    };
    loadUser();
  }, []);

  const { data: existingCompany } = useQuery({
    queryKey: ['companyProfile', user?.email],
    queryFn: async () => {
      const companies = await base44.entities.CompanyProfile.filter({ created_by: user?.email });
      return companies[0];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (existingCompany) {
      setCompanyProfile(existingCompany);
      setStep(2);
    }
  }, [existingCompany]);

  const createCompanyMutation = useMutation({
    mutationFn: (data) => base44.entities.CompanyProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      setStep(2);
    },
  });

  const createJobMutation = useMutation({
    mutationFn: (data) => base44.entities.JobOpportunity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobOpportunities'] });
      navigate(createPageUrl("ConnectWorld"));
    },
  });

  const handleAddItem = (type) => {
    if (type === 'requirement' && requirementInput.trim()) {
      setJobData(prev => ({ ...prev, requirements: [...prev.requirements, requirementInput] }));
      setRequirementInput("");
    } else if (type === 'benefit' && benefitInput.trim()) {
      setJobData(prev => ({ ...prev, benefits: [...prev.benefits, benefitInput] }));
      setBenefitInput("");
    } else if (type === 'accessibility' && accessibilityInput.trim()) {
      setJobData(prev => ({ ...prev, accessibility_features: [...prev.accessibility_features, accessibilityInput] }));
      setAccessibilityInput("");
    } else if (type === 'accommodation' && accommodationInput.trim()) {
      setCompanyProfile(prev => ({
        ...prev,
        neurodiversity_program: {
          ...prev.neurodiversity_program,
          accommodations_offered: [...prev.neurodiversity_program.accommodations_offered, accommodationInput]
        }
      }));
      setAccommodationInput("");
    }
  };

  const handleSubmitCompany = () => {
    createCompanyMutation.mutate(companyProfile);
  };

  const handleSubmitJob = () => {
    const company = existingCompany || companyProfile;
    createJobMutation.mutate({
      ...jobData,
      company: company.company_name,
      location: company.location,
      country: company.location.split(',').pop().trim(),
      neurodivergent_friendly: true,
      posted_by_ai: false,
      is_active: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => step === 1 ? navigate(createPageUrl("ConnectWorld")) : setStep(1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-10 h-10" />
          <h1 className="text-3xl font-bold">Postar Vaga Inclusiva</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-purple-600' : 'bg-white/30'}`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className="font-semibold">Perfil da Empresa</span>
          </div>
          <div className="h-0.5 w-12 bg-white/30" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-purple-600' : 'bg-white/30'}`}>
              2
            </div>
            <span className="font-semibold">Detalhes da Vaga</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
 
