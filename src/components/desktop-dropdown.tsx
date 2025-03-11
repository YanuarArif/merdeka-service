import { DropdownNavigation } from "@/components/ui/dorpdown-navigation";
import { desktopMenuItems } from "@/constants/header-nav-links";

function DesktopDropDown() {
  return (
    <div className="relative gap-5 flex flex-col items-center justify-center py-2 ">
      <NavigationDemo />
    </div>
  );
}

function NavigationDemo() {
  return <DropdownNavigation navItems={desktopMenuItems} />;
}

export { DesktopDropDown };
