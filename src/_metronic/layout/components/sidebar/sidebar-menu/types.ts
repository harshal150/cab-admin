export interface MenuItem {
    name: string;
    icon: string;
    svg_location:string;
    route: string;
    submenu?: MenuItem[];
  }
  
  export interface MenuGroup {
    name: string;
    menu: MenuItem[];
    submenu?: MenuItem[];
  }
  