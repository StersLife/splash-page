import { useDisclosure } from "@chakra-ui/react";
import { createContext, FC, useContext, useState } from "react";


const contextObject = createContext(null);




const OnboardingContextProvider:FC<any>  =  ({children , currentStep,setCurrentStep}) => {
    const  { isOpen: isActionBoxOpen, onToggle:  onActionBoxToggle } = useDisclosure();
    const [allProgress,  setAllProgress] = useState([]);
    const [counts, setCounts] = useState({
        bedrooms:  0,
        bathrooms:  0,
        occupency: 0,
    });

    const [selectedDescriptor, setSelectedDescriptor] = useState([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [selectedAmentities, setSelectedAmenities] = useState([]);
    const [tone, setTone] = useState('')


    const [location, setLocation] = useState({
        coordinates: [],
        locationText: ''
    })

    return (
        /* @ts-ignore */
        <contextObject.Provider value={{
            counts, setCounts,
            location, setLocation,
            selectedDescriptor, setSelectedDescriptor,
            tone, setTone, 
            isActionBoxOpen, 
            onActionBoxToggle,
            allProgress,  setAllProgress,
            selectedPropertyType, setSelectedPropertyType,
            selectedActivities, setSelectedActivities,
            selectedAmentities, setSelectedAmenities,
            currentStep,setCurrentStep
        }}>
            {children}
        </contextObject.Provider>
    )

};


const  useOnboardingContext = () => {
    const context = useContext(contextObject);
    if (context === undefined) {
        throw new Error('useCount must be used within a CountProvider')
      }
      return context
};


export {
    OnboardingContextProvider,
    useOnboardingContext
}