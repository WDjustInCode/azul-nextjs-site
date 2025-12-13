"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useRef, useEffect } from "react";
import QuoteLayout from "./components/QuoteLayout";
import {
  QuoteState,
  StepId,
  ServiceCategory,
  PoolSize,
} from "./components/types";
import { StepAddress } from "./components/StepAddress";
import { StepManualAddress } from "./components/StepManualAddress";
import { StepResidentialOrCommercial } from "./components/StepResidentialOrCommercial";
import { StepResidentialServiceType } from "./components/StepResidentialServiceType";
import { StepRegularPoolType } from "./components/StepRegularPoolType";
import { StepRegularSpecialFlags } from "./components/StepRegularSpecialFlags";
import { StepPoolSize } from "./components/StepPoolSize";
import { StepEmailCapture } from "./components/StepEmailCapture";
import { StepContactInfo } from "./components/StepContactInfo";
import { StepAboveGroundNotice } from "./components/StepAboveGroundNotice";
import { StepEquipmentOptions } from "./components/StepEquipmentOptions";
import { CommercialForm } from "./components/CommercialForm";
import { ThankYouStep } from "./components/ThankYouStep";
import { calculateServicePrice } from "../utils/pricing";

function QuoteWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressFromUrl = searchParams.get("address") || undefined;
  const stepFromUrl = searchParams.get("step") as StepId | null;

  const [state, setState] = useState<QuoteState>({
    address: addressFromUrl,
    firstName: undefined,
    lastName: undefined,
    phone: undefined,
    email: undefined,
    segment: null,
    serviceCategory: null,
    equipmentSelections: [],
    specialFlags: {
      aboveGroundPool: false,
      saltwaterPool: false,
      treesOverPool: false,
    },
    poolSize: undefined,
  });

  // Determine initial step: check URL step param, then address, then default
  const getInitialStep = (): StepId => {
    if (stepFromUrl === "manual-address-entry") {
      return "manual-address-entry";
    }
    if (stepFromUrl === "commercial-form") {
      return "commercial-form";
    }
    if (addressFromUrl) {
      return "contact-info";
    }
    return "address-entry";
  };
  
  const initialStep: StepId = getInitialStep();
  const [step, setStep] = useState<StepId>(initialStep);
  const [stepHistory, setStepHistory] = useState<StepId[]>([initialStep]);

  // Use ref to always access the latest state value (avoids closure issues)
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Get previous step from history
  const getPreviousStep = (): StepId | null => {
    if (stepHistory.length <= 1) return null;
    return stepHistory[stepHistory.length - 2];
  };

  const goToStep = (newStep: StepId) => {
    setStepHistory((prev) => [...prev, newStep]);
    setStep(newStep);
  };

  const goBack = () => {
    const previousStep = getPreviousStep();
    if (previousStep) {
      setStepHistory((prev) => prev.slice(0, -1));
      setStep(previousStep);
    }
  };

  // Send quote to API and store in Supabase Storage
  const completeFlow = async (nextStep: StepId = "thank-you", emailOverride?: string) => {
    // Get the latest state, and use email override if provided
    let finalState = stateRef.current;
    
    // If email override is provided, merge it into the state
    if (emailOverride) {
      finalState = { ...finalState, email: emailOverride };
      // Also update the ref immediately for consistency
      stateRef.current = finalState;
    }
    
    console.log("Final quote state:", finalState);
    
    // Validate that email is present (required for data deletion compliance)
    const hasEmail = finalState.email || finalState.commercial?.email;
    if (!hasEmail) {
      console.error('Quote submission failed: Email is required but missing', finalState);
      alert('Email is required to submit your quote. Please provide your email address.');
      return; // Don't proceed without email
    }
    
    // Calculate pricing based on service request
    try {
      const pricing = await calculateServicePrice(finalState);
      console.log("Service pricing calculation:", {
        monthlyTotal: `$${pricing.monthlyTotal.toFixed(2)}/month`,
        annualTotal: `$${(pricing.monthlyTotal * 12).toFixed(2)}/year`,
        breakdown: pricing.breakdown,
      });
    } catch (error) {
      console.error("Error calculating pricing:", error);
    }
    
    // Send quote to API route for Supabase Storage upload
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalState),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Quote submitted successfully with email:', hasEmail);
      } else {
        console.error('Failed to submit quote:', result.error);
        // Show user-friendly error if rate limited
        if (response.status === 429) {
          alert('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 400) {
          alert('Invalid quote data. Please check that all required fields are filled.');
        }
      }
    } catch (error) {
      console.error('Error sending quote to API:', error);
      // Continue to thank you page even if upload fails
    }
    
    goToStep(nextStep);
  };

  const goToAboveGroundNotice = () => {
    goToStep("above-ground-notice");
  };

  // ---- step render switch ----
  const renderStep = () => {
    switch (step) {
      case "address-entry":
        return (
          <StepAddress
            onSubmit={(address) => {
              setState((s) => ({ ...s, address }));
              goToStep("contact-info");
            }}
            onBack={null}
            onSkip={() => {
              // Navigate to manual address entry form
              goToStep("manual-address-entry");
            }}
          />
        );

      case "manual-address-entry":
        // Check if user came from home (stepHistory has only manual-address-entry)
        // vs from assisted address entry (has address-entry in history)
        const cameFromHome = stepHistory.length === 1 && stepHistory[0] === "manual-address-entry";
        return (
          <StepManualAddress
            onSubmit={(addressData) => {
              // Format address as a single string
              const formattedAddress = `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zip}`;
              setState((s) => ({ ...s, address: formattedAddress }));
              goToStep("contact-info");
            }}
            onBack={cameFromHome ? () => {
              // If came from home, navigate back to home
              router.push("/");
            } : (() => {
              // If came from assisted address entry, go back to that step
              const previousStep = getPreviousStep();
              if (previousStep) {
                goBack();
              } else {
                // Fallback: go to address entry
                goToStep("address-entry");
              }
            })}
          />
        );

      case "contact-info":
        return (
          <StepContactInfo
            initialValues={{
              firstName: state.firstName,
              lastName: state.lastName,
              email: state.email,
              phone: state.phone,
            }}
            onSubmit={(info) => {
              setState((s) => ({ ...s, ...info }));
              goToStep("res-or-comm");
            }}
            onBack={
              getPreviousStep()
                ? goBack
                : (() => {
                  goToStep("address-entry");
                })
            }
          />
        );

      case "res-or-comm":
        return (
          <StepResidentialOrCommercial
            onSelect={(segment) => {
              if (segment === "commercial") {
                setState((s) => ({ ...s, segment }));
                goToStep("commercial-form");
              } else {
                setState((s) => ({ ...s, segment }));
                goToStep("res-service-type");
              }
            }}
            onBack={getPreviousStep() ? goBack : null}
          />
        );

      case "res-service-type":
        return (
          <StepResidentialServiceType
            onSelect={(category: ServiceCategory, otherText?: string) => {
              setState((s) => ({ 
                ...s, 
                serviceCategory: category,
                serviceCategoryOther: otherText 
              }));
              if (category === "regular") {
                goToStep("res-regular-pool-type");
              } else if (category === "equipment") {
                goToStep("res-equipment-options");
              } else if (category === "filter") {
                goToStep("res-filter-pool-type");
              } else if (category === "green") {
                goToStep("res-green-email");
              } else {
                // "other"
                goToStep("res-other-pool-type");
              }
            }}
            onBack={goBack}
          />
        );

      // -------- REGULAR SERVICE BRANCH --------

      case "res-regular-pool-type":
        return (
          <StepRegularPoolType
            onSelect={(poolType, otherText?: string) => {
              setState((s) => ({ 
                ...s, 
                poolType,
                poolTypeOther: otherText 
              }));
              if (poolType === "hot-tub") {
                // hot tub only → email → thank you
                goToStep("res-regular-email");
              } else {
                // pool-only, pool-spa, other → flags step
                goToStep("res-regular-flags");
              }
            }}
            onBack={goBack}
          />
        );

      case "res-regular-flags":
        return (
          <StepRegularSpecialFlags
            onNext={(flags) => {
              setState((s) => ({ ...s, specialFlags: flags }));
              if (flags.aboveGroundPool) {
                // spec: above-ground pool → can't clean, chemical-only step
                goToAboveGroundNotice();
              } else if (flags.saltwaterPool || flags.treesOverPool) {
                goToStep("res-regular-size");
              } else {
                // none of the above → still go to size
                goToStep("res-regular-size");
              }
            }}
            onBack={goBack}
          />
        );

      case "res-regular-size":
        return (
          <StepPoolSize
            onNext={(size: PoolSize) => {
              setState((s) => ({ ...s, poolSize: size }));
              goToStep("res-regular-email");
            }}
            onBack={goBack}
          />
        );

      case "res-regular-email":
        return (
          <StepEmailCapture
            initialEmail={state.email || ""}
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow("thank-you", email);
            }}
            onBack={goBack}
          />
        );

      // -------- EQUIPMENT BRANCH --------

      case "res-equipment-options":
        return (
          <StepEquipmentOptions
            onNext={(selected, otherText?: string) => {
              setState((s) => ({ 
                ...s, 
                equipmentSelections: selected,
                equipmentOther: otherText 
              }));
              goToStep("res-equipment-pool-type");
            }}
            onBack={goBack}
          />
        );

      case "res-equipment-pool-type":
        return (
          <StepRegularPoolType
            title="What does this equipment serve?"
            subtitle="Choose the pool or spa this equipment is for."
            onSelect={(poolType, otherText?: string) => {
              setState((s) => ({ 
                ...s, 
                poolType,
                poolTypeOther: otherText 
              }));
              if (poolType === "hot-tub") {
                // above-ground hot tub → email → thank you
                goToStep("res-equipment-email");
              } else {
                // pool-only, pool+spa, other → flags
                goToStep("res-equipment-flags");
              }
            }}
            onBack={goBack}
          />
        );

      case "res-equipment-flags":
        return (
          <StepRegularSpecialFlags
            onNext={(flags) => {
              setState((s) => ({ ...s, specialFlags: flags }));
              if (flags.aboveGroundPool) {
                goToAboveGroundNotice();
              } else if (flags.saltwaterPool || flags.treesOverPool) {
                goToStep("res-equipment-size");
              } else {
                goToStep("res-equipment-size");
              }
            }}
            onBack={goBack}
          />
        );

      case "res-equipment-size":
        return (
          <StepPoolSize
            onNext={(size) => {
              setState((s) => ({ ...s, poolSize: size }));
              goToStep("res-equipment-email");
            }}
            onBack={goBack}
          />
        );

      case "res-equipment-email":
        return (
          <StepEmailCapture
            initialEmail={state.email || ""}
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow("thank-you", email);
            }}
            onBack={goBack}
          />
        );

      // -------- FILTER / SALT CELL BRANCH --------

      case "res-filter-pool-type":
        return (
          <StepRegularPoolType
            title="What do we clean for you?"
            subtitle="Filter or salt cell cleaning for pools and spas."
            onSelect={(poolType, otherText?: string) => {
              setState((s) => ({ 
                ...s, 
                poolType,
                poolTypeOther: otherText 
              }));
              if (poolType === "hot-tub") {
                // hot tub only → email → thank you
                goToStep("res-filter-email");
              } else {
                // pool-only, pool-spa, other → flags step
                goToStep("res-filter-flags");
              }
            }}
            onBack={goBack}
          />
        );

      case "res-filter-flags":
        return (
          <StepRegularSpecialFlags
            onNext={(flags) => {
              setState((s) => ({ ...s, specialFlags: flags }));
              if (flags.aboveGroundPool) {
                // spec: above-ground pool → can't clean, chemical-only step
                goToAboveGroundNotice();
              } else {
                goToStep("res-filter-size");
              }
            }}
            onBack={goBack}
          />
        );

      case "res-filter-size":
        return (
          <StepPoolSize
            onNext={(size) => {
              setState((s) => ({ ...s, poolSize: size }));
              goToStep("res-filter-email");
            }}
            onBack={goBack}
          />
        );

      case "res-filter-email":
        return (
          <StepEmailCapture
            initialEmail={state.email || ""}
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow("thank-you", email);
            }}
            onBack={goBack}
          />
        );

      // -------- GREEN TO CLEAN BRANCH --------

      case "res-green-email":
        return (
          <StepEmailCapture
            title="We need to see your pool in person"
            subtitle="Share your email and we'll reach out to schedule an on-site visit for your green-to-clean rescue."
            cta="Schedule my visit"
            initialEmail={state.email || ""}
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow("thank-you", email);
            }}
            onBack={goBack}
          />
        );

      // -------- OTHER RESIDENTIAL BRANCH --------

      case "res-other-pool-type":
        return (
          <StepRegularPoolType
            title="Tell us about your pool"
            subtitle="This helps us customize your quote."
            onSelect={(poolType, otherText?: string) => {
              setState((s) => ({ 
                ...s, 
                poolType,
                poolTypeOther: otherText 
              }));
              goToStep("res-other-size");
            }}
            onBack={goBack}
          />
        );

      case "res-other-size":
        return (
          <StepPoolSize
            onNext={(size) => {
              setState((s) => ({ ...s, poolSize: size }));
              goToStep("res-other-email");
            }}
            onBack={goBack}
          />
        );

      case "res-other-email":
        return (
          <StepEmailCapture
            initialEmail={state.email || ""}
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow("thank-you", email);
            }}
            onBack={goBack}
          />
        );

      // -------- ABOVE-GROUND NOTICE --------

      case "above-ground-notice":
        return (
          <StepAboveGroundNotice
            onEmailSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow("thank-you", email);
            }}
            onBack={goBack}
            initialEmail={state.email || ""}
          />
        );

      // -------- COMMERCIAL FORM --------

      case "commercial-form":
        return (
          <CommercialForm
            onSubmit={(data) => {
              setState((s) => ({ ...s, commercial: data }));
              completeFlow();
            }}
            onBack={goBack}
          />
        );

      // -------- THANK YOU --------

      case "thank-you":
      default:
        return <ThankYouStep address={state.address} />;
    }
  };

  return <QuoteLayout>{renderStep()}</QuoteLayout>;
}

export default function QuoteWizardPage() {
  return (
    <Suspense fallback={<QuoteLayout><div className="text-center py-10">Loading...</div></QuoteLayout>}>
      <QuoteWizardContent />
    </Suspense>
  );
}

