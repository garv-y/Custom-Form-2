import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldBuilder from "./FieldBuilder";
import FieldRenderer from "./FieldRenderer";
import { useTheme } from "./ThemeContext";
import type { Field } from "../types";
import FAB from "./FAB";

let idCounter = 1;

const FormBuilder: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [fields, setFields] = useState<Field[]>(() => {
    const templateFields = localStorage.getItem("templateForm");
    if (templateFields) {
      localStorage.removeItem("templateForm");
      return JSON.parse(templateFields);
    }
    return [];
  });

  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [submittedData, setSubmittedData] = useState<
    Record<number, string | string[]>
  >({});

  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const [showAlert, setShowAlert] = useState(false);

  const addField = (type: Field["type"]) => {
    const newField: Field = {
      id: idCounter++,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Label`,
      required: false,
      options: ["Option 1", "Option 2"].filter(() =>
        ["dropdown", "checkboxes", "multipleChoice"].includes(type)
      ),
    };
    setFields([...fields, newField]);
  };

  const updateField = (updated: Field) => {
    setFields(fields.map((f) => (f.id === updated.id ? updated : f)));
  };

  const deleteField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleInputChange = (id: number, value: string | string[]) => {
    setSubmittedData({ ...submittedData, [id]: value });
  };

  const handleSubmit = () => {
    const newErrors: Record<number, boolean> = {};

    fields.forEach((field) => {
      if (
        field.required &&
        (!submittedData[field.id] || submittedData[field.id].length === 0)
      ) {
        newErrors[field.id] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill all required fields.");
      return;
    }

    setErrors({}); // clear previous errors

    const formSubmission = {
      id: Date.now(),
      title: formTitle,
      timestamp: new Date().toISOString(),
      data: submittedData,
      fields,
    };

    const saved = JSON.parse(localStorage.getItem("recentForms") || "[]");
    const updated = [formSubmission, ...saved];
    localStorage.setItem("recentForms", JSON.stringify(updated));

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
    navigate(`/view/${formSubmission.id}`);
  };

  return (
    <div
      className={`container-fluid py-4 min-vh-100 position-relative ${
        theme === "dark" ? "bg-dark text-white" : ""
      }`}
    >
      <div
        className={`d-flex justify-content-between align-items-center mb-4 sticky-top py-2 px-3 border-bottom ${
          theme === "dark"
            ? "bg-dark text-white border-secondary"
            : "bg-light text-dark border-bottom"
        }`}
      >
        <h2 className="mb-0">Form Builder</h2>
        <div className="d-flex gap-2">
          <button
            onClick={toggleTheme}
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
            }`}
          >
            Switch To {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <button
            onClick={() => navigate("/")}
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
            }`}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <input
            className={`form-control mb-3 fw-bold fs-4 ${
              theme === "dark"
                ? "bg-dark text-white border-secondary"
                : "bg-white text-dark"
            }`}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          {fields.map((field) => (
            <FieldBuilder
              key={field.id}
              field={field}
              updateField={updateField}
              deleteField={deleteField}
            />
          ))}
        </div>

        <div className="col-md-6 border-start">
          <h4 className="mb-3">Live Preview</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {fields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={submittedData[field.id]}
                onChange={(val) => handleInputChange(field.id, val)}
                error={errors[field.id]} // ✅ add this
              />
            ))}
            <button type="submit" className="btn btn-outline-success mt-3">
              Submit
            </button>
          </form>

          {Object.keys(submittedData).length > 0 && (
            <div className="mt-4">
              <h5>Submitted Values:</h5>
              <pre className="bg-light text-dark p-3 rounded">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}

          {showAlert && (
            <div className="alert alert-success mt-3" role="alert">
              Form submitted and saved to Dashboard!
            </div>
          )}
        </div>
      </div>

      {/* ✅ FAB added at the end for floating add field */}
      <FAB onAddField={addField} />
    </div>
  );
};

export default FormBuilder;
