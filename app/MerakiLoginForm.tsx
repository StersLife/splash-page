// app/MerakiLoginForm.tsx
import React, { useState, useEffect } from "react";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  company?: string;
  baseGrantUrl: string;
  userContinueUrl: string;
  nodeMac: string;
  clientIp: string;
  clientMac: string;
}

const MerakiLoginForm = ({ makeUrl }: { makeUrl: string }) => {
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    company: "",
    baseGrantUrl: "",
    userContinueUrl: "",
    nodeMac: "",
    clientIp: "",
    clientMac: "",
  });

  useEffect(() => {
    // Parsing URL parameters and initializing form state
    const searchParams = new URLSearchParams(window.location.search);
    setFormData({
      firstname: searchParams.get("firstname") || "",
      lastname: searchParams.get("lastname") || "",
      email: searchParams.get("email") || "",
      company: searchParams.get("company") || "",
      baseGrantUrl: decodeURIComponent(
        searchParams.get("base_grant_url") || "",
      ),
      userContinueUrl: decodeURIComponent(
        searchParams.get("user_continue_url") || "",
      ),
      nodeMac: searchParams.get("node_mac") || "",
      clientIp: searchParams.get("client_ip") || "",
      clientMac: searchParams.get("client_mac") || "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(makeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      console.log("Form submitted successfully:", formData);
      alert("Thank you for submitting! Redirecting...");
      window.location.href =
        formData.baseGrantUrl +
        "?continue_url=" +
        encodeURIComponent(formData.userContinueUrl);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Company (Optional)</label>
          <input
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Log in to WiFi
        </button>
      </form>
    </div>
  );
};

export default MerakiLoginForm;
