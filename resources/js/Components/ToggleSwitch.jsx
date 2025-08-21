import React, { useState } from "react";

export default function ToggleSwitch({ enabled, setEnabled=()=>{} }) {

  return (
    <button
      onClick={(e) => { e.preventDefault(); setEnabled(!enabled)}}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 
        ${enabled ? "bg-blue-500" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
