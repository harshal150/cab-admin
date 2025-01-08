import React from 'react';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarMenuItem } from './SidebarMenuItem';
import { MenuItem, MenuGroup } from './types'; // Import the defined interfaces

interface SidebarMenuMainProps {
  menus: MenuGroup[]; // Receive the menus as a prop
}

const SidebarMenuMain: React.FC<SidebarMenuMainProps> = ({ menus }) => {

  return (
    <>
      {menus.map((menuGroup: MenuGroup, menuGroupIndex: number) => (
        <div className="menu-item" key={menuGroupIndex}>
          <div className="pt-8 pb-2">
            <span className="section-name menu-section text-muted text-uppercase fs-8 ls-1">
              {menuGroup.name}
            </span>
            
            </div>
            {menuGroup.menu.map((menuItem: MenuItem, menuItemIndex: number) => (
              <React.Fragment key={menuItemIndex}>
                {menuItem.submenu && menuItem.submenu.length > 0 ? (
                  <SidebarMenuItemWithSub
                    to={menuItem.route}
                    title={menuItem.name}
                    icon={`/media/icons/duotune/${menuItem.svg_location}/${menuItem.icon}.svg`}
                    fontIcon="bi-app-indicator"
                  >
                    {menuItem.submenu.map((submenuItem: MenuItem, subIndex: number) => (
                      <React.Fragment key={subIndex}>
                        {submenuItem.submenu && submenuItem.submenu.length > 0 ? (
                          <SidebarMenuItemWithSub
                            to={submenuItem.route}
                            title={submenuItem.name}
                            hasBullet={true}
                          >
                            {submenuItem.submenu.map((subSubMenuItem: MenuItem, subSubIndex: number) => (
                              <SidebarMenuItem
                                to={subSubMenuItem.route}
                                title={subSubMenuItem.name}
                                hasBullet={true}
                                key={subSubIndex}
                              />
                            ))}
                          </SidebarMenuItemWithSub>
                        ) : (
                          <SidebarMenuItem
                            to={submenuItem.route}
                            title={submenuItem.name}
                            hasBullet={true}
                            key={subIndex}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </SidebarMenuItemWithSub>
                ) : (
                  <SidebarMenuItem
                    to={menuItem.route}
                    title={menuItem.name}
                    icon={`/media/icons/duotune/${menuItem.svg_location}/${menuItem.icon}.svg`}
                    fontIcon="bi-app-indicator"
                    hasBullet={false}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        // </div>
      ))}
    </>
  );
};

export default SidebarMenuMain;
