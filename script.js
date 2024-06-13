const courseTypeDropdown = document.getElementById("course-type");
const courseDropdown = document.getElementById("course");
const semesterDropdown = document.getElementById("semester");
const subjectDropdown = document.getElementById("subject");

const jsonData = fetch("http://localhost:8080/getCourseType")
  .then((response) => {
    response.json();
  })
  .then((jsonData) => {
    jsonData.forEach((courseData) => {
      const option = document.createElement("option");
      option.value = courseData.id;
      option.textContent = courseData.course;
      courseTypeDropdown.appendChild(option);
    });

    courseTypeDropdown.addEventListener("change", () => {
      const selectedCourseId = courseTypeDropdown.value;
      courseDropdown.innerHTML += '<option value="">Select Course</option>';
      semesterDropdown.innerHTML += '<option value="">Select Semester</option>';
      subjectDropdown.innerHTML += '<option value="">Select Subject</option>';
      if (selectedCourseId) {
        const selectedCourse = jsonData.find(
          (courseData) => courseData.id === parseInt(selectedCourseId)
        );
        if (selectedCourse && selectedCourse.courses) {
          selectedCourse.courses.forEach((subCourse) => {
            const option = document.createElement("option");
            option.value = subCourse.courseId;
            option.textContent = subCourse.courseName;
            courseDropdown.appendChild(option);
          });
        }
      }
    });

    courseDropdown.addEventListener("change", () => {
      const selectedSubCourseId = courseDropdown.value;
      semesterDropdown.innerHTML = '<option value="">Select Semester</option>';

      if (selectedSubCourseId) {
        const selectedCourse = jsonData.find(
          (courseData) => courseData.id === parseInt(courseTypeDropdown.value)
        );
        if (selectedCourse && selectedCourse.courses) {
          const selectedSubCourse = selectedCourse.courses.find(
            (subCourse) => subCourse.courseId === parseInt(selectedSubCourseId)
          );

          if (selectedSubCourse && selectedSubCourse.semester) {
            selectedSubCourse.semester.forEach((semesterData) => {
              const option = document.createElement("option");
              option.value = semesterData.masterSemester.id;
              option.textContent = semesterData.masterSemester.semester;
              semesterDropdown.appendChild(option);
            });
          }
        }
      }
    });
    semesterDropdown.addEventListener("change", () => {
      const selectedSemesterId = semesterDropdown.value;
      subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
      if (selectedSemesterId) {
        const selectedCourse = jsonData.find(
          (courseData) => courseData.id === parseInt(courseTypeDropdown.value)
        );
        if (selectedCourse && selectedCourse.courses) {
          const selectedSubCourse = selectedCourse.courses.find(
            (subCourse) => subCourse.courseId === parseInt(courseDropdown.value)
          );
          if (selectedSubCourse && selectedSubCourse.semester) {
            const selectedSemester = selectedSubCourse.semester.find(
              (semesterData) =>
                semesterData.masterSemester.id === parseInt(selectedSemesterId)
            );
            if (selectedSemester && selectedSemester.subject) {
              selectedSemester.subject.forEach((subjectData) => {
                const option = document.createElement("option");
                option.value = subjectData.id;
                option.textContent = subjectData.subjectname;
                subjectDropdown.appendChild(option);
              });
            }
          }
        }
      }
    });
  });
document.addEventListener("DOMContentLoaded", function () {
  const courseTypeDropdown = document.getElementById("course-type");
  const courseDropdown = document.getElementById("course");
  const semesterDropdown = document.getElementById("semester");
  const subjectDropdown = document.getElementById("subject");

  const resetDropdowns = () => {
    const dropdowns = document.querySelectorAll(".styled-select");
    dropdowns.forEach((dropdown) => {
      dropdown.selectedIndex = 0; // Set the selected index to the default (first) option
    });

    const table = document.getElementById("data-table");
    table.innerHTML = "";
  };

  document.getElementById("button").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const dataTable = document.getElementById("data-table");
    dataTable.style.display = "table";

    const selectedCourseTypeId = courseTypeDropdown.value;
    const selectedCourseId = courseDropdown.value;
    const selectedSemester = semesterDropdown.value;
    const selectedSubjectId = subjectDropdown.value;

    const selectedData = {
      courseTypeId: selectedCourseTypeId,
      courseId: selectedCourseId,
      semester: selectedSemester,
      subjectId: selectedSubjectId,
    };
    const jsonData = JSON.stringify(selectedData);
    fetch("http://localhost:8080/getExam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        const table = document.getElementById("data-table");
        table.innerHTML = ""; // Clear the table
        const headerRow = table.insertRow(0);
        const headers = ["Subject", "Session", "Download"];
        for (let i = 0; i < headers.length; i++) {
          const headerCell = headerRow.insertCell(i);
          headerCell.innerHTML = headers[i];
        }
        data.forEach((item, index) => {
          const row = table.insertRow(index + 1);
          const cell1 = row.insertCell(0);
          cell1.textContent = item.name;
          const cell2 = row.insertCell(1);
          cell2.textContent = item.session;
          const cell3 = row.insertCell(2);
          const downloadButton = document.createElement("button");
          downloadButton.textContent = "Download";
          downloadButton.addEventListener("click", () => {
            const recordId = item.id; // Get the ID from the row
            fetch(`http://localhost:8080/filesV2/${recordId}`)
              .then((response) => response.blob())
              .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = `${item.name}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
              })
              .catch((error) => {
                console.error("Error downloading file:", error);
              });
          });
          cell3.appendChild(downloadButton);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    resetDropdowns(); // Call the reset function when the button is clicked
  });

  //   document.addEventListener("contextmenu", function (e) {
  //     e.preventDefault();
  //   });
});

// navbar
const burger = document.getElementById("burger");
const close = document.getElementById("close");
const mobileMenu = document.getElementById("mobile-menu");

burger.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
  mobileMenu.classList.add("flex");
  burger.classList.add("hidden");
  close.classList.remove("hidden");
});

close.addEventListener("click", () => {
  mobileMenu.classList.remove("flex");
  mobileMenu.classList.add("hidden");
  burger.classList.remove("hidden");
  close.classList.add("hidden");
});

// sign in and sign up modal

function signInAndSignUp() {
  document.addEventListener("DOMContentLoaded", function () {
    const signInModal = document.getElementById("signInModal");
    const signUpModal = document.getElementById("signUpModal");

    const openSignInModal = document.getElementById("openSignInModal");
    const openSignUpModal = document.getElementById("openSignUpModal");

    const closeSignInModal = document.getElementById("closeSignInModal");
    const closeSignUpModal = document.getElementById("closeSignUpModal");

    function showModal(modal) {
      modal.classList.remove("modal-hidden");
      modal.classList.add("modal-visible");
      modal.setAttribute("aria-hidden", "false");
    }

    function hideModal(modal) {
      modal.classList.remove("modal-visible");
      modal.classList.add("modal-hidden");
      modal.setAttribute("aria-hidden", "true");
    }

    openSignInModal.addEventListener("click", function () {
      showModal(signInModal);
    });

    openSignUpModal.addEventListener("click", function () {
      showModal(signUpModal);
    });

    closeSignInModal.addEventListener("click", function () {
      hideModal(signInModal);
    });

    closeSignUpModal.addEventListener("click", function () {
      hideModal(signUpModal);
    });

    window.addEventListener("click", function (event) {
      if (event.target === signInModal) {
        hideModal(signInModal);
      }
      if (event.target === signUpModal) {
        hideModal(signUpModal);
      }
    });

    // Form Validation
    document
      .getElementById("signUpForm")
      .addEventListener("submit", function (event) {
        const password = document.getElementById("signUpPassword").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          event.preventDefault();
        }
      });
  });
}

signInAndSignUp();
