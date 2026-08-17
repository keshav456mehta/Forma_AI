// Day 10: Sample story fixtures for testing AI extraction
// Each story should extract fields matching one of the seeded forms.

export const sampleStories = [
  {
    name: "Basic Information - Simple",
    story: "My name is Rajesh Kumar and I live in India. I agree to the terms.",
    expectedFields: {
      fullName: "Rajesh Kumar",
      country: "India",
      terms: true,
    },
    formTitle: "Basic Information",
  },
  {
    name: "Basic Information - US variant",
    story: "I'm Sarah Johnson from the United States. Yes, I accept the terms and conditions.",
    expectedFields: {
      fullName: "Sarah Johnson",
      country: "United States",
      terms: true,
    },
    formTitle: "Basic Information",
  },
  {
    name: "Insurance Claim - with insurance",
    story: "My name is Amit Sharma. I have insurance with ICICI Lombard. I confirm the information is correct.",
    expectedFields: {
      fullName: "Amit Sharma",
      hasInsurance: "Yes",
      insuranceCompany: "ICICI Lombard",
      terms: true,
    },
    formTitle: "Insurance Claim",
  },
  {
    name: "Insurance Claim - no insurance",
    story: "I'm Priya Verma and I don't have any insurance. I confirm this information.",
    expectedFields: {
      fullName: "Priya Verma",
      hasInsurance: "No",
      // insuranceCompany should NOT be filled (showIf condition not met)
      terms: true,
    },
    formTitle: "Insurance Claim",
  },
  {
    name: "Vehicle Registration - Car",
    story: "Vehicle owner is Vikram Singh. It's a Car with registration number DL1234.",
    expectedFields: {
      ownerName: "Vikram Singh",
      vehicleType: "Car",
      vehicleNumber: "DL1234",
      terms: true,
    },
    formTitle: "Vehicle Registration",
  },
  {
    name: "Vehicle Registration - Bike",
    story: "My name is Karan Patel. I'm registering a Bike, registration MH5678. I confirm the details.",
    expectedFields: {
      ownerName: "Karan Patel",
      vehicleType: "Bike",
      vehicleNumber: "MH5678",
      terms: true,
    },
    formTitle: "Vehicle Registration",
  },
  {
    name: "Incomplete story - partial extraction",
    story: "I'm John Doe and I live in the United Kingdom.",
    expectedFields: {
      fullName: "John Doe",
      country: "United Kingdom",
      // terms should NOT be filled (not mentioned)
    },
    formTitle: "Basic Information",
  },
];
