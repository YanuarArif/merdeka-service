import { LucidePackageSearch } from "lucide-react";
import React from "react";
import { FiMapPin } from "react-icons/fi";
import { TbRosetteDiscount } from "react-icons/tb";

function Announcement() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 hidden md:flex justify-between text-sm">
      <div className="flex container justify-between">
        <div className="flex items-center gap-1 dark:text-gray-300">
          <span>Selamat datang di Merdeka Service</span>
        </div>
        <div className="flex items-center gap-4 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <FiMapPin className="text-gray-600 dark:text-gray-400" />
            <span>Bobotsari, Purbalingga</span>
          </div>
          <span className="dark:text-gray-500">|</span>
          <div className="flex justify-center items-center gap-1">
            <LucidePackageSearch
              size={20}
              className="flex-shrink-0 dark:text-gray-400"
            />
            <button className="hover:text-gray-600 dark:hover:text-gray-400">
              Lacak Pesanan
            </button>
          </div>
          <span className="dark:text-gray-500">|</span>
          <div className="flex justify-center items-center gap-1">
            <TbRosetteDiscount
              size={20}
              className="flex-shrink-0 dark:text-gray-400"
            />
            <button className="hover:text-gray-600 dark:hover:text-gray-400">
              Diskon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announcement;
