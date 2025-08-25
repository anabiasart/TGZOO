







// @type {import('tailwindcss').Config} */
//export default {
  //content: [
   // "./index.html",
    //"./src/**/*.{vue,js,ts,jsx,tsx}",
  //],
  //theme: {
    //extend: {
      //colors: {
        //lilas: {
          //400: "#c084fc", // lilás claro
          //500: "#a855f7", // lilás médio
          //600: "#9333ea", // lilás escuro
          //300: "#ede3fb", //cute
          //150:"#5c906e", //verde escuro
          //100:"#abe2bc", //verde claro
        //},
      //},
   // },
 // },
  //plugins: [],
//

//}
const colors = require('tailwindcss/colors')
//colors
module.exports = {
  theme: {
    colors: {
      // Build your palette here
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.sky,
      yellow: colors.amber,
      purple: colors.purple,
      teal: colors.teal,
      emerald:colors.emerald,
      cyan: colors.cyan,

    }
    
  }
}
//background
  module.exports = {
    variants: {
      extend: {
       backgroundAttachment: ['hover', 'focus'],
       backgroundAttachment: false,
       backgroundClip: ['hover', 'focus'],
       backgroundClip: false,
       backgroundColor: ['active'],
       backgroundColor: false,
        backgroundOpacity: ['active'],
        backgroundOpacity: false,
        backgroundOrigin: ['hover', 'focus'],
        backgroundOrigin: false,  
      backgroundPosition: ['hover', 'focus'],
      backgroundPosition: false,
      backgroundRepeat: ['hover', 'focus'],
      backgroundRepeat: false,
      backgroundSize: ['hover', 'focus'],
      backgroundSize: false,
      gradientColorStops: ['active', 'group-hover'],
      gradientColorStops: false,
      borderRadius: ['hover', 'focus'],
      borderRadius:false,
      }
    }
  }
  //background color/derivas de position

    module.exports = {
    theme: {
      backgroundColor: theme => ({
       ...theme('colors'),
       'primary': '#3490dc',
       'secondary': '#ffed4a',
       'danger': '#e3342f',
      }), 
      //posicição da bodega
      backgroundPosition: {
        bottom: 'bottom',
       'bottom-4': 'center bottom 1rem',
        center: 'center',
        left: 'left',
       'left-bottom': 'left bottom',
       'left-top': 'left top',
        right: 'right',
        'right-bottom': 'right bottom',
        'right-top': 'right top',
        top: 'top',
       'top-4': 'center top 1rem',
      },

      //tamanho e afins
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
       '50%': '50%',
       '16': '4rem',
      },
      //gradiente
       gradientColorStops: theme => ({
       ...theme('colors'),
       'primary': '#3490dc',
       'secondary': '#ffed4a',
       'danger': '#e3342f',
      }),
      //borda
           borderRadius: {
        'none': '0',
       'sm': '0.125rem',
       DEFAULT: '0.25rem',
       DEFAULT: '4px',
       'md': '0.375rem',
       'lg': '0.5rem',
       'full': '9999px',
       'large': '12px',
      }
    
      
    }
  }

  //opacidade
  module.exports = {
    theme: {
      extend: {
        opacity: {
         '15': '0.15',
         '35': '0.35',
         '65': '0.65',
        }
        
      }
    }
  }

  module.exports = {
    theme: {
      extend: {
        backgroundOpacity: {
         '10': '0.1',
         '20': '0.2',
         '95': '0.95',
        }
      }
    }
  }