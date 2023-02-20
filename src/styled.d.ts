// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    boxColor: string;
    bdRadius: string;
    fontColor: string;

    colors: {
      main: string;
      secondary: string;
      btn: string;
    };
  }
}
