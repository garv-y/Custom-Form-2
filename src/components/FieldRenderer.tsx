import React from "react";
import type { Field } from "../types";

interface FieldRendererProps {
  field: Field;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  error?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error = false,
}) => {
  const renderError = () =>
    error && <small className="text-danger">This field is required.</small>;

  const baseInputClass = `form-control ${error ? "border-danger" : ""}`;

  switch (field.type) {
    case "header":
      return <h1>{field.label}</h1>;

    case "label":
      return <label className="fw-bold">{field.label}</label>;

    case "paragraph":
      return <p>{field.label}</p>;

    case "linebreak":
      return <hr />;

    case "text":
      return (
        <div className="mb-3">
          <label>{field.label}</label>
          <input
            type="text"
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {renderError()}
        </div>
      );

    case "number":
      return (
        <div className="mb-3">
          <label>{field.label}</label>
          <input
            type="number"
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {renderError()}
        </div>
      );

    case "dropdown":
      return (
        <div className="mb-3">
          <label>{field.label}</label>
          <select
            className={baseInputClass}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {renderError()}
        </div>
      );

    case "checkboxes":
      return (
        <div className="mb-3">
          <label className="d-block">{field.label}</label>
          {field.options?.map((opt, i) => (
            <div key={i} className="form-check">
              <input
                className={`form-check-input ${
                  error ? "border border-danger" : ""
                }`}
                type="checkbox"
                checked={Array.isArray(value) && value.includes(opt)}
                onChange={(e) => {
                  if (Array.isArray(value)) {
                    onChange(
                      e.target.checked
                        ? [...value, opt]
                        : value.filter((v) => v !== opt)
                    );
                  } else {
                    onChange(e.target.checked ? [opt] : []);
                  }
                }}
              />
              <label className="form-check-label">{opt}</label>
            </div>
          ))}
          {renderError()}
        </div>
      );

    case "multipleChoice":
      return (
        <div className="mb-3">
          <label className="d-block">{field.label}</label>
          {field.options?.map((opt, i) => (
            <div key={i} className="form-check">
              <input
                className={`form-check-input ${
                  error ? "border border-danger" : ""
                }`}
                type="radio"
                name={`field-${field.id}`}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              <label className="form-check-label">{opt}</label>
            </div>
          ))}
          {renderError()}
        </div>
      );

    case "tags":
      return (
        <div className="mb-3">
          <label>{field.label}</label>
          <input
            type="text"
            className={baseInputClass}
            placeholder="Comma-separated tags"
            value={typeof value === "string" ? value : ""}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== "")
              )
            }
          />
          {renderError()}
        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;
