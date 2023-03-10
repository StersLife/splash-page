import { extendTheme } from "@chakra-ui/react";


const  theme = extendTheme({
    fonts: {
        heading: `'Hind Vadodara', sans-serif`,
        body: `'Hind Vadodara', sans-serif`,
        paragraph: `'Hind Vadodara', sans-serif`
   
    },
    components: {
        Button: {
          // 1. We can update the base styles
          baseStyle: {
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '24px'
            
          },

          variants: {
            'primary': {
                borderRadius: '60px',
                bg: '#FE7146',
                boxShadow: '0px 20px 40px -10px rgba(243, 144, 114, 0.26)'
            }
          },
          defaultProps: {
            variant: 'primary', 
          },


        },
      },
});

export {theme}