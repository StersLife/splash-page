import React, { FC, useState } from 'react'
import { OnboardingContextProvider, useOnboardingContext } from '../../context/onboardingContext';
import { Login } from '../Auth/Login';
import { Signup } from '../Auth/Signup';
import { OnboardingLayout } from './OnboardingLayout'
import { ResultContainer } from './ResultContainer';
import { Activities } from './UI/Activities';
import { Amenities } from './UI/Amenities';
import { Descriptor } from './UI/Descriptor';
import { Location } from './UI/Location';
import { Property } from './UI/property';

let stepObject: any = {
  locations: <Location />,
  descriptor: <Descriptor />,
  property: <Property />,
  activities: <Activities />,
  amenities: <Amenities />,
};

enum AuthMode {
  Signup = 'signup',
  Login = 'login',
}

const  Auth:FC  = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.Signup);
  /* @ts-ignore */
  const { setCurrentStep } = useOnboardingContext()
  
  switch(mode) {
    case AuthMode.Signup:
      return <Signup onModeChanged={(val:  AuthMode) => setMode(val)} setCurrentStep={setCurrentStep} />;
    case AuthMode.Login:
      return <Login onModeChanged={(val:  AuthMode) => setMode(val)} setCurrentStep={setCurrentStep}  />
      default: return null
  }

}
export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<any>('locations');
  return (
    <OnboardingContextProvider currentStep={currentStep} setCurrentStep={setCurrentStep}>
      {
      stepObject[currentStep] ?  ( <OnboardingLayout  currentStep={currentStep}  onStepChange={(val: string) => setCurrentStep(val)}>
      {
        stepObject[currentStep]
      } 
     </OnboardingLayout>) :  currentStep === 'loading' ? <ResultContainer />  : ''
      }
      {
        currentStep === 'auth' && <Auth />
      }
     </OnboardingContextProvider>

  )
}
