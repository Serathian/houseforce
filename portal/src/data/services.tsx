import React from 'react';
import { 
  Hammer, Wrench, HardHat, Paintbrush, Ruler, Pickaxe, Settings, Brush,
  Key, Lock, House, Umbrella, Sun, Droplets, SprayCan, Sparkles
} from 'lucide-react';

export const constItems = [
  { icon: <Hammer />, label: "General Building", desc: "Expert brickwork, extensions, and structural changes.", href: "/services/construction#building" },
  { icon: <Wrench />, label: "Plumbing & Electrics", desc: "Certified installations and complete system rewires.", href: "/services/construction#plumbing" },
  { icon: <HardHat />, label: "Project Management", desc: "Full end-to-end oversight of your renovation.", href: "/services/construction#management" },
  { icon: <Paintbrush />, label: "Painting & Decorating", desc: "Premium interior and exterior finishes.", href: "/services/construction#painting" },
  { icon: <Ruler />, label: "Planning", desc: "Architectural drawings and local permissions.", href: "/services/construction#planning" },
  { icon: <Pickaxe />, label: "Renovations", desc: "Complete property modernisation.", href: "/services/construction#renovations" },
  { icon: <Settings />, label: "Custom Fitting", desc: "Bespoke kitchens, bathrooms, and carpentry.", href: "/services/construction#fitting" },
  { icon: <Brush />, label: "Plastering", desc: "Smooth finishes and exterior rendering.", href: "/services/construction#plastering" }
];

export const keyItems = [
  { icon: <Key />, label: "Meet & Greet", desc: "Personal check-ins for your holiday guests.", href: "/services/keyholding#greet" },
  { icon: <SprayCan />, label: "Deep Cleaning", desc: "Thorough sanitisation between visits.", href: "/services/keyholding#cleaning" },
  { icon: <House />, label: "Property Inspections", desc: "Regular checks for leaks, pests, or damage.", href: "/services/keyholding#inspections" },
  { icon: <Umbrella />, label: "Holiday Home Care", desc: "Complete management of your rental.", href: "/services/keyholding#care" },
  { icon: <Droplets />, label: "Plumbing Flushes", desc: "Preventing stagnant water and pipe issues.", href: "/services/keyholding#plumbing" },
  { icon: <Lock />, label: "Security Checks", desc: "Ensuring doors, windows, and alarms are secure.", href: "/services/keyholding#security" },
  { icon: <Sparkles />, label: "Changeover Cleans", desc: "Fast, spotless turnaround for new guests.", href: "/services/keyholding#changeovers" },
  { icon: <Sun />, label: "Worry-Free Vacations", desc: "24/7 local emergency contact for peace of mind.", href: "/services/keyholding#vacations" }
];
