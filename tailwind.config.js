







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
