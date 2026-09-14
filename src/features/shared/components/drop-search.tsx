import React from "react";

const DropSearch = ({
  options,
  label,
  value,
  setValue,
}: {
  options: string[];
  label: string;
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={label}>{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={label}
        className="input h-12"
      >
        {options.map((item) => (
          <option
            key={item}
            value={item}
            className="text-white bg-secondary-bg"
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropSearch;
