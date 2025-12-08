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
    if (addressFromUrl) {
      return "res-or-comm";
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

  // You can swap this with a real API call
  const completeFlow = (nextStep: StepId = "thank-you") => {
    const finalState = stateRef.current;
    console.log("Final quote state:", finalState);
    
    // Calculate pricing based on service request
    try {
      const pricing = calculateServicePrice(finalState);
      console.log("Service pricing calculation:", {
        monthlyTotal: `$${pricing.monthlyTotal.toFixed(2)}/month`,
        annualTotal: `$${(pricing.monthlyTotal * 12).toFixed(2)}/year`,
        breakdown: pricing.breakdown,
      });
    } catch (error) {
      console.error("Error calculating pricing:", error);
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
              goToStep("res-or-comm");
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
              goToStep("res-or-comm");
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
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow();
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
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow();
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
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow();
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
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow();
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
            onSubmit={(email) => {
              setState((s) => ({ ...s, email }));
              completeFlow();
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
              completeFlow();
            }}
            onBack={goBack}
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

