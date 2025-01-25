
// Navbar.jsx
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { useState } from 'react';
import Profile from '@/Components/ui/Profile';
import Dashboard from '@/Pages/Dashboard';

export default function Navbar({ user }) {
  const [activeTab, setActiveTab] = useState('Profile'); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigation = [
    { name: 'Profile', href: '#', current: true },
    { name: 'Dashboard', href: '#', current: false },
    { name: 'My Courses', href: '#', current: false },
    { name: 'Reports', href: '#', current: false },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }


const Navbar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">Navbar</a>
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange(item.name); // Update active tab
                      }}
                      aria-current={activeTab === item.name ? 'page' : undefined} // Add current logic
                      className={classNames(
                        activeTab === item.name ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Settings Icon */}
                <button
                  type="button"
                  className="relative rounded-full bg-transparent p-1 text-black-400 hover:text-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Settings</span>
                  <FaCog aria-hidden="true" className="h-6 w-6" />
                </button>
                {/* Notification Icon */}
                <button
                  type="button"
                  className="relative rounded-full bg-transparent p-1 text-black-400 hover:text-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <FaBell aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <IoMenu aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                <FaXmark aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>
    </nav>
    </>
  );
};

export default Navbar;
