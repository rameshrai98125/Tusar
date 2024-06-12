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

// model
// Get the modal
var modal = document.getElementById("signInModal");

// Get the button that opens the modal
var btn = document.getElementById("signInBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
