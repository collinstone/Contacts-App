import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ContactWidgetProps {
  fullName: string;
  email: string;
  phone: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContactWidget: React.FC<ContactWidgetProps> = ({
  fullName,
  email,
  phone,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="
      bg-white rounded-lg shadow-md overflow-hidden 
      hover:shadow-xl hover:scale‑105 transition-transform duration‑300
      w-full mx-auto
      my-4
    ">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 ">
        <h2 className="text-lg font-medium text-gray-800 truncate">
          {fullName}
        </h2>
        <div className="flex space-x-3">
        <Link href = {"./editform"}>
          <button
            type="button"
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
            aria-label="Edit contact"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </Link>
          <button
            type="button"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            aria-label="Delete contact"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <span className="font-semibold text-gray-600">Email:</span>
          <span className="text-gray-800 break-all">{email}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <span className="font-semibold text-gray-600">Phone:</span>
          <span className="text-gray-800">{phone}</span>
        </div>
      </div>
    </div>
  );
};
