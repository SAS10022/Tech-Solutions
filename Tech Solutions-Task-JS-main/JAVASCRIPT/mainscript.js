const companyData = {
  company: "Tech Solutions",
  employees: [
    { id: 1, name: "Ahmed Hassan", department: "Frontend", position: "Senior Developer", salary: 25000, age: 29, isActive: true, skills: ["JavaScript", "React", "CSS"] },
    { id: 2, name: "Mariam Ali", department: "Backend", position: "Backend Developer", salary: 22000, age: 27, isActive: true, skills: ["Node.js", "SQL", "Express"] },
    { id: 3, name: "Omar Mohamed", department: "Frontend", position: "Junior Developer", salary: 12000, age: 24, isActive: true, skills: ["JavaScript", "HTML", "CSS"] },
    { id: 4, name: "Sara Ibrahim", department: "UI/UX", position: "UI Designer", salary: 18000, age: 26, isActive: false, skills: ["Figma", "CSS", "Design"] },
    { id: 5, name: "Youssef Adel", department: "Backend", position: "Senior Developer", salary: 30000, age: 32, isActive: true, skills: ["Node.js", "MongoDB", "SQL"] },
    { id: 6, name: "Nour Samir", department: "Frontend", position: "Mid-Level Developer", salary: 20000, age: 28, isActive: false, skills: ["React", "TypeScript", "CSS"] },
    { id: 7, name: "Khaled Mostafa", department: "QA", position: "QA Engineer", salary: 16000, age: 30, isActive: true, skills: ["Testing", "JavaScript", "Selenium"] },
    { id: 8, name: "Laila Tarek", department: "UI/UX", position: "Senior Designer", salary: 26000, age: 31, isActive: true, skills: ["Figma", "Design", "Prototyping"] },
  ],
};

// Gets the employee data from companyData and selects the required HTML elements.
// Stores references to the employee grid, search, filters, buttons, and counters.
// Initializes the JavaScript skills filter as off and salary sorting as descending.

const employees = companyData.employees;
const grid = document.querySelector("[data-employee-grid]");
const searchInput = document.querySelector("#employee-search");
const departmentFilter = document.querySelector("#department-filter");
const activeOnly = document.querySelector("#active-only");
const visibleCount = document.querySelector("[data-visible-count]");
const recordCount = document.querySelector("[data-record-count]");
const javascriptFilter = document.querySelector("#javascript-filter");
const salarySortButton = document.querySelector("#salary-sort");

let javascriptOnly = false;
let salaryDescending = true;


// finds every HTML element with a data-company-name attribute and sets its text content to the company name from the companyData object. This ensures that the company name is displayed consistently across the webpage wherever the data-company-name attribute is used.

document.querySelectorAll("[data-company-name]").forEach((element) => {
  element.textContent = companyData.company;
});


// this builds the department menu from the data so it stays in sync with employees.
// this goes through the employees array (result) , it starts as an empty array because the last argument is [] then checks whether that department is already in the list and if not, it adds it to the list.

const departments = employees.reduce((result, employee) => {
  if (!result.includes(employee.department)) result.push(employee.department);
  return result;
}, []);

// this creates the menu options from the list rather than hard-coding each one in html.

departments.forEach((department) => departmentFilter.add(new Option(department, department)));

// this finds every HTML element with a data-department-total attribute and sets its text content to the total number of unique departments calculated earlier. This ensures that the department count is displayed correctly on the webpage wherever the data-department-total attribute is used.

document.querySelectorAll("[data-department-total]").forEach((element) => {
  element.textContent = departments.length;
});


// it hold a count for each department , processes employees one by one then an empty object is being built ,accesses the count for the current employee’s department and uses zero if that department does not have a count yet , adds the current employee to that department’s count and carries the updated object to the next pass.

//  single pass through the employees can build a useful lookup of department names and their employee counts. it creates that lookup; later code can use it to display the counts.

const departmentCounts = employees.reduce((counts, employee) => {
  counts[employee.department] = (counts[employee.department] || 0) + 1;
  return counts;
}, {});


// this gives the number of active employees without changing the original employees array.

const activeCount = employees.filter((employee) => employee.isActive).length;

// adds up the salaries , the salary sum is needed for the average salary shown below.

const salaryTotal = employees.reduce((total, employee) => total + employee.salary, 0);

// Finds every element marked with data-total-employees. Puts the total number of employees(employees.length) into each one.

document.querySelectorAll("[data-total-employees]").forEach((element) => {
  element.textContent = employees.length;
});

// this calculation produces a readable whole dollar average,it assumes employees contains at least one employee; otherwise, dividing by zero would produce an invalid result , and with .toLocaleString() it formats the number with sepators.

document.querySelector("[data-average-salary]").textContent = `$${Math.round(salaryTotal / employees.length).toLocaleString()}`;

// finds the first element marked with data - active - employees and displays the active employee count calculated earlier.

document.querySelector("[data-active-employees]").textContent = activeCount;

// displays the active employee count in a format that shows the number of active employees out of the total number of employees.

document.querySelector("[data-online-count]").textContent = `/ ${activeCount} online`;

// this finds the highest paid employee by creating a shallow copy of the employees array , orders that copy by salary , sorts from highest salary to lowest and that The sorted copy is stored in employeesBySalary.

const employeesBySalary = [...employees].sort((a, b) => b.salary - a.salary);

// it returns the first employee that matches the condition , then employeesBySalary[0] is the first item in the descending salary order, so it should be the highest-paid employee , then the condition compares IDs to find that same employee in the sorted list.

const highestPaidEmployee = employeesBySalary.find((employee) => employee.id === employeesBySalary[0].id);

// finds the first element marked data - highest - paid - name and displays the employee’s name.

document.querySelector("[data-highest-paid-name]").textContent = highestPaidEmployee.name;

// Displays that employee’s salary with a dollar sign and thousands separators.

document.querySelector("[data-highest-paid-salary]").textContent = `$${highestPaidEmployee.salary.toLocaleString()}`;

//this checks the employee data, builds safe HTML for each employee card, and displays either the cards or a “no results” message.

const hasInactiveEmployees = employees.some((employee) => !employee.isActive);
const allEmployeesHaveSkills = employees.every((employee) => employee.skills.length > 0);

// document.querySelector(...) finds the first HTML element with the data-inactive-check attribute. Then, the element is saved in inactiveCheck so the code can update it.

const inactiveCheck = document.querySelector("[data-inactive-check]");
inactiveCheck.textContent = hasInactiveEmployees && allEmployeesHaveSkills ? "Team data is up to date" : "Review employee data";


// this function takes text and replaces special characters with safe versions so the browser doesn't accidentally treat the text as html code.

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

// this creates an html card for one employee , Determines the employee's status and CSS class using a ternary operator , uses map() to turn each skill into a <span> tag, then join("") combines them , uses escapeHtml() to safely insert text into HTML and template literal to insert employee details into the cardand then formats the salary with commas and returns the complete HTML string.

function renderCard(employee) {
  const statusClass = employee.isActive ? "active-status" : "inactive-status";
  const statusText = employee.isActive ? "Active" : "Inactive";
  const skillTags = employee.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("");
  return `<article class="employee-card">
    <div class="employee-card-header">
      <div><h2>${escapeHtml(employee.name)}</h2>
      <p>${escapeHtml(employee.position)} <i></i> <b>${escapeHtml(employee.department)}</b></p></div>
      <span class="status ${statusClass}"><span></span>${statusText}</span>
    </div>
    <div class="employee-salary"><span>Monthly salary</span><strong>$${employee.salary.toLocaleString()} <small>/ month</small></strong></div>
    <div class="skills" aria-label="Skills">${skillTags}</div>
  </article>`;
}

// it displays employee cards in the grid , If there is no employees match, it shows a message depending on whether a search was entered , uses map() to create a card for each employee and join("") to combine them into one HTML string.and the updates the grid.innerHTML to display the results.

function renderEmployees(employeeList) {
  if (!employeeList.length) {
    const query = searchInput.value.trim();
    const queryMessage = query
      ? `No employees match “${escapeHtml(query)}”. Try changing your search or filters.`
      : "No employees match the selected filters. Try changing your filters.";
    grid.innerHTML = `<div class="empty-results" role="status"><div class="empty-results-icon" aria-hidden="true">⌕</div><h1>No employees found</h1><p>${queryMessage}</p></div>`;
    return;
  }
  grid.innerHTML = employeeList.map(renderCard).join("");
}
// finds all elements with a department count attribute,gets each element's department name using dataset and the displays the department's employee count, or 0 if no count exists.

document.querySelectorAll("[data-department-count-for]").forEach((element) => {
  const department = element.dataset.departmentCountFor;
  element.textContent = `(${departmentCounts[department] || 0})`;
});


// this filters employees based on search text, department, active status, and JavaScript skills, Uses filter() to keep only employees who match all selected conditions, then converts names to lowercase for case-insensitive searching and stores the matching employees in matchingEmployees.

function updateDirectory() {
  const searchText = searchInput.value.trim().toLocaleLowerCase();
  const selectedDepartment = departmentFilter.value;
  let matchingEmployees = employees.filter((employee) => {
    const nameMatches = employee.name.toLocaleLowerCase().includes(searchText);
    const departmentMatches = selectedDepartment === "All Departments" || employee.department === selectedDepartment;
    const activeMatches = !activeOnly.checked || employee.isActive;
    const skillMatches = !javascriptOnly || employee.skills.includes("JavaScript");
    return nameMatches && departmentMatches && activeMatches && skillMatches;
  });


  // this copies the matching employees and sorts them by salary , then sorts highest to lowest or lowest to highest based on salaryDescending , displays the sorted employee cards and updates the number of visible employees and the total employee count.

  matchingEmployees = [...matchingEmployees].sort((a, b) => salaryDescending ? b.salary - a.salary : a.salary - b.salary);
  renderEmployees(matchingEmployees);
  visibleCount.textContent = matchingEmployees.length;
  recordCount.textContent = employees.length;
}

// this highlights the tab matching the selected department and adds "is-active" to the matching tab and removes it from the others.

function highlightSelectedTab() {
  document.querySelectorAll(".department-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.department === departmentFilter.value);
  });
}
// Toggles the JavaScript skills filter on or off.
// Updates the button's active style and accessibility state.
// Refreshes the employee list based on the selected filters.

javascriptFilter.addEventListener("click", () => {
  javascriptOnly = !javascriptOnly;
  javascriptFilter.classList.toggle("is-active", javascriptOnly);
  javascriptFilter.setAttribute("aria-pressed", String(javascriptOnly));
  updateDirectory();
});

// Toggles the salary sorting order between descending and ascending.
// Activates the sort button and updates its accessibility state and label.
// Refreshes the employee list using the new sorting order.

salarySortButton.addEventListener("click", () => {
  salaryDescending = !salaryDescending;
  salarySortButton.classList.add("is-active");
  salarySortButton.setAttribute("aria-pressed", "true");
  salarySortButton.querySelector("[data-sort-label]").textContent = salaryDescending ? "Sort by salary (desc)" : "Sort by salary (asc)";
  updateDirectory();
});

// Updates the employee list when the search text or active filter changes.
// Updates the employee list and highlights the selected department tab when the department changes.

searchInput.addEventListener("input", updateDirectory);
activeOnly.addEventListener("change", updateDirectory);
departmentFilter.addEventListener("change", () => {
  updateDirectory();
  highlightSelectedTab();
});

// Adds click events to department tabs to filter employees by department.
// Updates the employee list and highlights the selected tab.
// Calls updateDirectory() initially to display the employees when the page loads.

document.querySelectorAll(".department-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    departmentFilter.value = tab.dataset.department;
    updateDirectory();
    highlightSelectedTab();
  });
});

updateDirectory();
