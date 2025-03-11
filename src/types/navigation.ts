//^ Type untuk MobileSideMenu
export interface SideMobileNavItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: SideMobileNavItem[];
}

export interface DropDownProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: SideMobileNavItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}
