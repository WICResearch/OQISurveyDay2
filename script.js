const scriptURL =
  "https://script.google.com/macros/s/AKfycbxI91amaiOWXl4UiVvdv1YCuoeCrrrxdmWc071fC7l5f6QY0i3QBTF02iI-n4GMayvJ3A/exec";

const scaleOptions = [
  "Strongly Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Strongly Agree"
];

let currentPage = 0;
const answers = {};

const pages = [
  {
    title: "Participant Information",
    description:
      "Please provide a few details about your role and experience with WIC.",
    fields: [
      {
        type: "select",
        name: "primaryRole",
        label: "What is your primary role?",
        required: true,
        options: [
          "Local Agency Director",
          "Nutritionist/RD",
          "CPA",
          "Breastfeeding Peer Counselor",
          "Breastfeeding Coordinator",
          "Outreach",
          "Office Associate",
          "State Agency",
          "Other"
        ]
      },
      {
        type: "text",
        name: "localAgency",
        label: "Which local agency or department do you work for?",
        required: true
      },
      {
        type: "select",
        name: "yearsInWIC",
        label: "How many years have you worked in WIC?",
        required: true,
        options: [
          "Less than 1 year",
          "1–5 years",
          "6–10 years",
          "11–20 years",
          "More than 20 years"
        ]
      }
    ]
  },

  {
    title: "Welcome and OQI Overview",
    subtitle:
      "OQI Purpose, Mission, Values, Agenda, and Consensus Decision-Making",
    description: "Please rate the following statements about this session.",
    fields: [
      {
        type: "scale",
        name: "welcomePresenterClear",
        label: "Presenter communicated clearly."
      },
      {
        type: "scale",
        name: "welcomeOrganized",
        label: "Session was well organized."
      },
      {
        type: "scale",
        name: "welcomeGoodUseOfTime",
        label: "Session was a good use of my time."
      },
      {
        type: "scale",
        name: "welcomeEasyToFollow",
        label: "Session was easy to follow."
      },
      {
        type: "textarea",
        name: "welcomeSuggestions",
        heading: "Suggestions",
        label: "What suggestions do you have for improving this session?"
      }
    ]
  },

  {
    title: "Policy Update",
    topics: [
      "Policy 1.29 – Quality Improvement Local Agency Responsibilities",
      "Foster Care Change of Custody",
      "Miscarriage Letters",
      "Policy 1.16"
    ],
    description: "Please rate the following statements about this session.",
    fields: [
      {
        type: "scale",
        name: "policyPresenterClear",
        label: "Presenter communicated clearly."
      },
      {
        type: "scale",
        name: "policyOrganized",
        label: "Session was well organized."
      },
      {
        type: "scale",
        name: "policyGoodUseOfTime",
        label: "Session was a good use of my time."
      },
      {
        type: "scale",
        name: "policyEasyToFollow",
        label: "Session was easy to follow."
      },
      {
        type: "textarea",
        name: "policySuggestions",
        heading: "Suggestions",
        label: "What suggestions do you have for improving this session?"
      }
    ]
  },

  {
    title: "Funding Discussion",
    topics: [
      "Spend-Down Options",
      "WIC Tents and WICI Funding",
      "WICI 2026 Masimo Pilot",
      "FY2027 Funding",
      "Overview of Projections",
      "Operations Grants Administration"
    ],
    description: "Please rate the following statements about this session.",
    fields: [
      {
        type: "scale",
        name: "fundingPresenterClear",
        label: "Presenter communicated clearly."
      },
      {
        type: "scale",
        name: "fundingOrganized",
        label: "Session was well organized."
      },
      {
        type: "scale",
        name: "fundingGoodUseOfTime",
        label: "Session was a good use of my time."
      },
      {
        type: "scale",
        name: "fundingEasyToFollow",
        label: "Session was easy to follow."
      },
      {
        type: "textarea",
        name: "fundingSuggestions",
        heading: "Suggestions",
        label: "What suggestions do you have for improving this session?"
      }
    ]
  },

  {
    title: "Local Operations",
    topics: [
      "Lead Testing Expansion",
      "Mental Health Certification Expansion"
    ],
    description: "Please rate the following statements about this session.",
    fields: [
      {
        type: "scale",
        name: "localOperationsPresenterClear",
        label: "Presenter communicated clearly."
      },
      {
        type: "scale",
        name: "localOperationsOrganized",
        label: "Session was well organized."
      },
      {
        type: "scale",
        name: "localOperationsGoodUseOfTime",
        label: "Session was a good use of my time."
      },
      {
        type: "scale",
        name: "localOperationsEasyToFollow",
        label: "Session was easy to follow."
      },
      {
        type: "textarea",
        name: "localOperationsSuggestions",
        heading: "Suggestions",
        label: "What suggestions do you have for improving this session?"
      }
    ]
  },

  {
    title: "Overall Reflection",
    description:
      "Please share any final thoughts about today’s OQI meeting.",
    fields: [
      {
        type: "textarea",
        name: "biggestTakeaway",
        label:
          "What is one idea or takeaway from today’s sessions that could help strengthen WV WIC?"
      },
      {
        type: "textarea",
        name: "additionalFeedback",
        label:
          "Is there anything else you would like the Office of Quality Improvement to know?"
      }
    ]
  }
];

const questionCard = document.getElementById("questionCard");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

function renderPage() {
  const page = pages[currentPage];

  questionCard.innerHTML = `
    <div class="section-heading">
      <p class="section-number">Section ${currentPage + 1}</p>
      <h2>${page.title}</h2>
      ${page.subtitle ? `<p class="section-subtitle">${page.subtitle}</p>` : ""}
    </div>

    ${
      page.topics
        ? `
          <div class="topics-box">
            <h3>Topics Covered</h3>
            <ul>
              ${page.topics.map((topic) => `<li>${topic}</li>`).join("")}
            </ul>
          </div>
        `
        : ""
    }

    ${
      page.description
        ? `<p class="section-description">${page.description}</p>`
        : ""
    }
  `;

  page.fields.forEach((field) => {
    questionCard.appendChild(createField(field));
  });

  progressText.textContent =
    `Section ${currentPage + 1} of ${pages.length}`;

  progressFill.style.width =
    `${((currentPage + 1) / pages.length) * 100}%`;

  backBtn.style.display = currentPage === 0 ? "none" : "inline-block";

  nextBtn.style.display =
    currentPage === pages.length - 1 ? "none" : "inline-block";

  submitBtn.style.display =
    currentPage === pages.length - 1 ? "inline-block" : "none";

  message.textContent = "";
}

function createField(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  if (field.heading) {
    const heading = document.createElement("h3");
    heading.className = "field-heading";
    heading.textContent = field.heading;
    wrapper.appendChild(heading);
  }

  const label = document.createElement("label");
  label.setAttribute("for", field.name);
  label.textContent = field.label;

  if (field.required) {
    const requiredMark = document.createElement("span");
    requiredMark.className = "required-mark";
    requiredMark.textContent = " *";
    label.appendChild(requiredMark);
  }

  wrapper.appendChild(label);

  if (field.type === "select" || field.type === "scale") {
    const select = document.createElement("select");

    select.id = field.name;
    select.name = field.name;
    select.required = field.required !== false;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select one";
    defaultOption.disabled = true;
    defaultOption.selected = true;

    select.appendChild(defaultOption);

    const options =
      field.type === "scale" ? scaleOptions : field.options;

    options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      select.appendChild(option);
    });

    if (answers[field.name]) {
      select.value = answers[field.name];
    }

    wrapper.appendChild(select);
  }

  if (field.type === "text") {
    const input = document.createElement("input");

    input.type = "text";
    input.id = field.name;
    input.name = field.name;
    input.value = answers[field.name] || "";
    input.required = field.required === true;

    wrapper.appendChild(input);
  }

  if (field.type === "textarea") {
    const textarea = document.createElement("textarea");

    textarea.id = field.name;
    textarea.name = field.name;
    textarea.rows = 5;
    textarea.value = answers[field.name] || "";
    textarea.required = field.required === true;
    textarea.placeholder = "Enter your response here...";

    wrapper.appendChild(textarea);
  }

  return wrapper;
}

function saveCurrentPage() {
  const fields = questionCard.querySelectorAll(
    "input, select, textarea"
  );

  fields.forEach((field) => {
    answers[field.name] = field.value.trim();
  });
}

function validateCurrentPage() {
  const fields = questionCard.querySelectorAll(
    "input, select, textarea"
  );

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
}

nextBtn.addEventListener("click", () => {
  if (!validateCurrentPage()) {
    return;
  }

  saveCurrentPage();
  currentPage++;
  renderPage();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

backBtn.addEventListener("click", () => {
  saveCurrentPage();
  currentPage--;
  renderPage();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

document
  .getElementById("surveyForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateCurrentPage()) {
      return;
    }

    saveCurrentPage();

    message.textContent = "Submitting your response...";
    submitBtn.disabled = true;

    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(answers)
    })
      .then(() => {
        document.getElementById("surveyForm").innerHTML = `
          <div class="thank-you-card">
            <div class="thank-you-icon">✓</div>

            <h1>Thank You!</h1>

            <p class="thank-you-lead">
              Thank you for completing the 2026 WV WIC OQI Day 1 Evaluation.
            </p>

            <p>
              Your feedback will be reviewed by the Office of Quality
              Improvement and used to strengthen future meetings, training
              opportunities, and statewide initiatives.
            </p>

            <p>
              We appreciate your time and continued commitment to serving
              West Virginia WIC participants.
            </p>

            <button type="button" onclick="location.reload()">
              Submit Another Response
            </button>
          </div>
        `;

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      })
      .catch((error) => {
        message.textContent =
          "There was an error submitting the survey. Please try again.";

        submitBtn.disabled = false;

        console.error("Submission error:", error);
      });
  });

document
  .getElementById("beginSurveyBtn")
  .addEventListener("click", () => {
    document.getElementById("introPage").style.display = "none";
    document.getElementById("surveyForm").style.display = "block";

    currentPage = 0;
    renderPage();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
